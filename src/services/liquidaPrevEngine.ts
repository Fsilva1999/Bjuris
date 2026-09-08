import {
  getIndiceManualJf2022,
  REAJUSTES_INSS_HISTORICO,
  SELIC_MENSAL_EC113,
  getFatorProporcionalReajusteInss
} from './previdenciarioData';

export interface ParametrosLiquidaPrev {
  tipoCalculo: 'liquidacao' | 'valor_causa';
  numeroProcesso: string;
  dataAjuizamento: string; // YYYY-MM-DD
  afastarPrescricao: boolean;
  autorNome: string;
  autorCpf: string;
  percentualAcordo: number; // 0 - 100 (padrão 100)

  // Criterios de Atualizacao
  criterioCorrecao: 'manual_jf_2022' | 'inpc' | 'ipca_e' | 'igp_di';
  databaseAtualizacao: string; // YYYY-MM (ex: 2026-09)
  criterioJuros: 'sem_juros' | 'selic' | '1pct_simples' | '05pct_poupanca' | 'manual_jf_2022';
  dataInicioJuros: string; // YYYY-MM
  aplicarSelicEc113: boolean; // Selic a partir de 12/2021

  // Benefício devido
  tipoOperacao: 'concessao' | 'restabelecimento';
  especieBeneficio: string;
  rmi: number; // Renda Mensal Inicial
  dib: string; // YYYY-MM-DD
  dibAnteriorDda?: string; // YYYY-MM-DD
  dataInicialParcelas: string; // YYYY-MM-DD
  dataFinalParcelas: string; // YYYY-MM-DD

  // 13º Salario
  abono13ApurarAutomatico: boolean;
  abono13ProporcionalUltimoAno: boolean;

  // Compensações e outros lançamentos
  beneficiosRecebidos: Array<{ competencia: string; valor: number; obs?: string }>;
  outrosCreditosDescontos: Array<{ competencia: string; tipo: 'credito' | 'desconto'; valor: number; obs?: string }>;

  // Honorários
  honorariosContratuaisPct: number;
  honorariosSucumbenciaisPct: number;
}

export interface LinhaMemoriaCalculo {
  competencia: string; // YYYY-MM
  rendaMensalEvoluida: number;
  diasProporcionais: number;
  valorMensalDevido: number;
  valor13Devido: number;
  valorDevidoTotal: number;
  valorRecebidoCompensado: number;
  outrosCreditosDescontos: number;
  diferencaHistorica: number;
  
  // Atualizacao
  nomeIndiceCorrecao: string;
  fatorCorrecao: number;
  valorCorrigido: number;
  
  // Juros & SELIC
  percentualJurosMora: number;
  valorJurosMora: number;
  percentualSelic: number;
  valorSelic: number;
  
  // Total da Competência
  totalCompetenciaAtualizado: number;
}

export interface ResultadoLiquidaPrev {
  linhasMemoria: LinhaMemoriaCalculo[];
  
  // Resumo financeiro
  totalHistoricoDevido: number;
  totalHistoricoRecebido: number;
  totalOutrosCreditosDescontos: number;
  diferencaHistoricaLiquida: number;
  
  totalCorrecaoMonetaria: number;
  totalJurosMora: number;
  totalSelic: number;
  
  totalBrutoAtualizado: number;
  valorAcordoBase: number;
  
  honorariosContratuaisValor: number;
  totalLiquidoCliente: number;
  honorariosSucumbenciaisValor: number;

  // Valor da Causa (Parcelas Vencidas + 12 Vincendas)
  valorCausaTotal: number;
  parcelasVencidasBrutas: number;
  parcelasVincendasFuturas: number;

  // Forma de pagamento
  isRpv: boolean;
  salariosMinimosEquivalentes: number;
  limiteRpvValor: number;
}

// ─── ENGINE MATEMÁTICO DETERMINÍSTICO ───────────────────────────────────────────
export function calcularLiquidaPrev(params: ParametrosLiquidaPrev): ResultadoLiquidaPrev {
  const SAL_MIN_2026 = 1518;
  const LIMITE_RPV = SAL_MIN_2026 * 60; // R$ 91.080,00

  // 1. Tratamento de Datas
  const dtDib = new Date(params.dib + 'T00:00:00');
  const dtInicial = new Date(params.dataInicialParcelas + 'T00:00:00');
  const dtFinal = new Date(params.dataFinalParcelas + 'T00:00:00');
  const dtAjuizamento = new Date(params.dataAjuizamento + 'T00:00:00');

  // Tratar Prescrição Quinquenal se não afastada
  let dtInicialEfetiva = new Date(dtInicial);
  if (!params.afastarPrescricao && !isNaN(dtAjuizamento.getTime())) {
    const dtPrescricao = new Date(dtAjuizamento);
    dtPrescricao.setFullYear(dtPrescricao.getFullYear() - 5);
    if (dtInicialEfetiva < dtPrescricao) {
      dtInicialEfetiva = dtPrescricao;
    }
  }

  // Mapa de Benefícios Recebidos por competência (YYYY-MM)
  const mapaRecebidos = new Map<string, number>();
  params.beneficiosRecebidos.forEach(b => {
    mapaRecebidos.set(b.competencia, (mapaRecebidos.get(b.competencia) || 0) + b.valor);
  });

  // Mapa de Outros Créditos/Descontos por competência
  const mapaOutros = new Map<string, number>();
  params.outrosCreditosDescontos.forEach(o => {
    const val = o.tipo === 'credito' ? o.valor : -o.valor;
    mapaOutros.set(o.competencia, (mapaOutros.get(o.competencia) || 0) + val);
  });

  // 2. Evolução Anual da Renda Mensal do Benefício
  // Para evoluir de DIB até o ano final, guardamos a renda para cada ano/mês
  const rendaEvoluidaPorAno: Record<number, number> = {};
  
  let anoDib = dtDib.getFullYear();
  let mesDib = dtDib.getMonth() + 1;
  if (params.dibAnteriorDda) {
    const dtDda = new Date(params.dibAnteriorDda + 'T00:00:00');
    if (!isNaN(dtDda.getTime())) {
      anoDib = dtDda.getFullYear();
      mesDib = dtDda.getMonth() + 1;
    }
  }

  let rendaAtual = params.rmi;
  rendaEvoluidaPorAno[anoDib] = rendaAtual;

  // Evoluir para os anos subsequentes usando os reajustes previdenciários oficiais
  const anoFinalCalculo = parseInt(params.databaseAtualizacao.split('-')[0]) || 2026;
  for (let ano = anoDib + 1; ano <= anoFinalCalculo; ano++) {
    const reaj = REAJUSTES_INSS_HISTORICO[ano] || { percentual: 3.8, mes: 1 };
    
    // Se for o 1º reajuste após a DIB, aplicar o fator proporcional
    let pctAplicado = reaj.percentual;
    if (ano === anoDib + 1) {
      const fatorProp = getFatorProporcionalReajusteInss(mesDib);
      pctAplicado = reaj.percentual * fatorProp;
    }

    rendaAtual = Number((rendaAtual * (1 + pctAplicado / 100)).toFixed(2));
    rendaEvoluidaPorAno[ano] = rendaAtual;
  }

  // 3. Iterar competência por competência no período das parcelas executadas
  const linhasMemoria: LinhaMemoriaCalculo[] = [];
  
  let anoCursor = dtInicialEfetiva.getFullYear();
  let mesCursor = dtInicialEfetiva.getMonth() + 1;

  const dtFinalComp = new Date(dtFinal);
  const anoFinal = dtFinalComp.getFullYear();
  const mesFinal = dtFinalComp.getMonth() + 1;

  // Data base de atualização (ano/mês)
  const [dbAno, dbMes] = params.databaseAtualizacao.split('-').map(Number);
  const dbAnoNum = dbAno || 2026;
  const dbMesNum = dbMes || 9;

  // Data de início dos juros
  const [jurosAno, jurosMes] = params.dataInicioJuros.split('-').map(Number);
  const jurosAnoNum = jurosAno || anoCursor;
  const jurosMesNum = jurosMes || mesCursor;

  while (
    anoCursor < anoFinal ||
    (anoCursor === anoFinal && mesCursor <= mesFinal)
  ) {
    const compStr = `${anoCursor}-${String(mesCursor).padStart(2, '0')}`;
    const rendaMes = rendaEvoluidaPorAno[anoCursor] || rendaAtual;

    // Proporcionalidade de dias se for o primeiro ou o último mês
    let diasProp = 30;
    if (anoCursor === dtInicialEfetiva.getFullYear() && mesCursor === (dtInicialEfetiva.getMonth() + 1)) {
      const diaInicio = dtInicialEfetiva.getDate();
      diasProp = Math.max(1, 30 - diaInicio + 1);
    } else if (anoCursor === anoFinal && mesCursor === mesFinal) {
      const diaFim = dtFinalComp.getDate();
      diasProp = Math.min(30, diaFim);
    }

    const valorMensalDevido = Number(((rendaMes * diasProp) / 30).toFixed(2));

    // 13º Salário no mês 12 ou proporcional no último ano
    let valor13Devido = 0;
    if (params.abono13ApurarAutomatico) {
      if (mesCursor === 12) {
        // Se a DIB foi no mesmo ano, calcula fração de meses trabalhados
        if (anoCursor === dtDib.getFullYear()) {
          const mesesTrabalhados = 12 - dtDib.getMonth();
          valor13Devido = Number(((rendaMes * mesesTrabalhados) / 12).toFixed(2));
        } else {
          valor13Devido = rendaMes;
        }
      } else if (params.abono13ProporcionalUltimoAno && anoCursor === anoFinal && mesCursor === mesFinal && mesFinal < 12) {
        valor13Devido = Number(((rendaMes * mesFinal) / 12).toFixed(2));
      }
    }

    const valorDevidoTotal = valorMensalDevido + valor13Devido;
    const valorRecebidoCompensado = mapaRecebidos.get(compStr) || 0;
    const valOutros = mapaOutros.get(compStr) || 0;

    const diferencaHistorica = Number((valorDevidoTotal - valorRecebidoCompensado + valOutros).toFixed(2));

    // ── Correção Monetária Competência por Competência ─────────────────────────
    const infoIndice = getIndiceManualJf2022(anoCursor, mesCursor);
    
    // Coeficiente acumulado de correção da competência até a data-base
    let fatorCorrecaoAcumulado = 1.0;
    let isSelicRegime = false;

    // Calcular meses entre a competência e a data-base
    const diffMesesDb = (dbAnoNum - anoCursor) * 12 + (dbMesNum - mesCursor);

    if (params.criterioCorrecao === 'manual_jf_2022') {
      // EC 113/2021: De 12/2021 em diante, aplica SELIC (correção + juros unificados)
      if (params.aplicarSelicEc113 && (anoCursor > 2021 || (anoCursor === 2021 && mesCursor >= 12))) {
        isSelicRegime = true;
      }

      if (!isSelicRegime && diffMesesDb > 0) {
        // Estimativa rigorosa de correção histórica (acumulado médio)
        const taxaAnualEstimada = infoIndice.variacaoPct;
        fatorCorrecaoAcumulado = Math.pow(1 + (taxaAnualEstimada / 100), diffMesesDb / 12);
      }
    } else {
      if (diffMesesDb > 0) {
        const taxaAnual = params.criterioCorrecao === 'inpc' ? 0.38 : 0.42;
        fatorCorrecaoAcumulado = Math.pow(1 + (taxaAnual / 100), diffMesesDb);
      }
    }

    const valorCorrigido = Number((diferencaHistorica * fatorCorrecaoAcumulado).toFixed(2));

    // ── Juros de Mora & SELIC ─────────────────────────────────────────────────
    let pctJurosMora = 0;
    let valorJurosMora = 0;
    let pctSelic = 0;
    let valorSelic = 0;

    const compEmJuros = (anoCursor > jurosAnoNum) || (anoCursor === jurosAnoNum && mesCursor >= jurosMesNum);

    if (isSelicRegime) {
      // No regime SELIC (EC 113/21), a SELIC já engloba atualização + juros
      // Soma a SELIC mensal acumulada de 12/2021 até a data-base
      let selicAcum = 0;
      let y = Math.max(2021, anoCursor);
      let m = (y === 2021) ? 12 : mesCursor;
      
      while (y < dbAnoNum || (y === dbAnoNum && m <= dbMesNum)) {
        const cKey = `${y}-${String(m).padStart(2, '0')}`;
        selicAcum += (SELIC_MENSAL_EC113[cKey] || 0.85);
        m++;
        if (m > 12) { m = 1; y++; }
      }

      pctSelic = Number(selicAcum.toFixed(2));
      valorSelic = Number((diferencaHistorica * (pctSelic / 100)).toFixed(2));
    } else if (compEmJuros && params.criterioJuros !== 'sem_juros') {
      if (params.criterioJuros === '1pct_simples') {
        const mesesJuros = Math.max(0, (dbAnoNum - anoCursor) * 12 + (dbMesNum - mesCursor));
        pctJurosMora = Number((mesesJuros * 1.0).toFixed(2));
      } else if (params.criterioJuros === '05pct_poupanca') {
        const mesesJuros = Math.max(0, (dbAnoNum - anoCursor) * 12 + (dbMesNum - mesCursor));
        pctJurosMora = Number((mesesJuros * 0.5).toFixed(2));
      } else {
        // Manual JF 2022 (0,5% a.m. a partir da citação até 11/2021, depois SELIC)
        const mesesJuros = Math.max(0, (dbAnoNum - anoCursor) * 12 + (dbMesNum - mesCursor));
        pctJurosMora = Number((mesesJuros * 0.5).toFixed(2));
      }
      valorJurosMora = Number((valorCorrigido * (pctJurosMora / 100)).toFixed(2));
    }

    const totalCompetenciaAtualizado = Number(
      (isSelicRegime ? (diferencaHistorica + valorSelic) : (valorCorrigido + valorJurosMora)).toFixed(2)
    );

    linhasMemoria.push({
      competencia: compStr,
      rendaMensalEvoluida: rendaMes,
      diasProporcionais: diasProp,
      valorMensalDevido,
      valor13Devido,
      valorDevidoTotal,
      valorRecebidoCompensado,
      outrosCreditosDescontos: valOutros,
      diferencaHistorica,
      nomeIndiceCorrecao: isSelicRegime ? 'SELIC (EC 113/21)' : infoIndice.nome,
      fatorCorrecao: Number(fatorCorrecaoAcumulado.toFixed(4)),
      valorCorrigido,
      percentualJurosMora: pctJurosMora,
      valorJurosMora,
      percentualSelic: pctSelic,
      valorSelic,
      totalCompetenciaAtualizado
    });

    // Avançar 1 mês
    mesCursor++;
    if (mesCursor > 12) {
      mesCursor = 1;
      anoCursor++;
    }
  }

  // 4. Totais Consolidados
  const totalHistoricoDevido = Number(linhasMemoria.reduce((acc, l) => acc + l.valorDevidoTotal, 0).toFixed(2));
  const totalHistoricoRecebido = Number(linhasMemoria.reduce((acc, l) => acc + l.valorRecebidoCompensado, 0).toFixed(2));
  const totalOutrosCreditosDescontos = Number(linhasMemoria.reduce((acc, l) => acc + l.outrosCreditosDescontos, 0).toFixed(2));
  const diferencaHistoricaLiquida = Number((totalHistoricoDevido - totalHistoricoRecebido + totalOutrosCreditosDescontos).toFixed(2));

  const totalCorrecaoMonetaria = Number(linhasMemoria.reduce((acc, l) => acc + (l.valorCorrigido - l.diferencaHistorica), 0).toFixed(2));
  const totalJurosMora = Number(linhasMemoria.reduce((acc, l) => acc + l.valorJurosMora, 0).toFixed(2));
  const totalSelic = Number(linhasMemoria.reduce((acc, l) => acc + l.valorSelic, 0).toFixed(2));

  const totalBrutoCalculado = Number(linhasMemoria.reduce((acc, l) => acc + l.totalCompetenciaAtualizado, 0).toFixed(2));

  // Aplicar Percentual do Acordo (ex: 100% ou 80%)
  const pctAcordoFator = (params.percentualAcordo || 100) / 100;
  const valorAcordoBase = Number((totalBrutoCalculado * pctAcordoFator).toFixed(2));

  // Honorários Contratuais & Sucumbenciais
  const honorariosContratuaisValor = Number((valorAcordoBase * ((params.honorariosContratuaisPct || 0) / 100)).toFixed(2));
  const honorariosSucumbenciaisValor = Number((valorAcordoBase * ((params.honorariosSucumbenciaisPct || 0) / 100)).toFixed(2));

  const totalLiquidoCliente = Number((valorAcordoBase - (params.honorariosContratuaisPct ? honorariosContratuaisValor : 0)).toFixed(2));

  // Valor da Causa (vencidas + 12 vincendas)
  const parcelasVencidasBrutas = totalHistoricoDevido;
  const parcelasVincendasFuturas = Number((12 * (rendaEvoluidaPorAno[anoFinalCalculo] || params.rmi)).toFixed(2));
  const valorCausaTotal = Number((parcelasVencidasBrutas + parcelasVincendasFuturas).toFixed(2));

  // RPV ou Precatório Federal
  const isRpv = valorAcordoBase <= LIMITE_RPV;
  const salariosMinimosEquivalentes = Number((valorAcordoBase / SAL_MIN_2026).toFixed(2));

  return {
    linhasMemoria,
    totalHistoricoDevido,
    totalHistoricoRecebido,
    totalOutrosCreditosDescontos,
    diferencaHistoricaLiquida,
    totalCorrecaoMonetaria,
    totalJurosMora,
    totalSelic,
    totalBrutoAtualizado: valorAcordoBase,
    valorAcordoBase,
    honorariosContratuaisValor,
    totalLiquidoCliente,
    honorariosSucumbenciaisValor,
    valorCausaTotal,
    parcelasVencidasBrutas,
    parcelasVincendasFuturas,
    isRpv,
    salariosMinimosEquivalentes,
    limiteRpvValor: LIMITE_RPV
  };
}
