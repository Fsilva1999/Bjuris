import React, { useState, useMemo, useRef } from 'react';
import { useLegal } from '../../context/LegalContext';
import {
  calcularLiquidaPrev,
  ParametrosLiquidaPrev,
  ResultadoLiquidaPrev
} from '../../services/liquidaPrevEngine';
import {
  Calculator,
  Gavel,
  Calendar,
  DollarSign,
  TrendingUp,
  Scale,
  Plus,
  Trash2,
  Printer,
  Copy,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building,
  User,
  Percent,
  Check
} from 'lucide-react';

export const CalculadoraLiquidaPrev: React.FC = () => {
  const { processos, clientes } = useLegal();

  // Etapa 1 — Tipo de cálculo
  const [tipoCalculo, setTipoCalculo] = useState<'liquidacao' | 'valor_causa'>('liquidacao');

  // Etapa 2 — Dados do processo
  const [numeroProcesso, setNumeroProcesso] = useState('0804812-39.2024.8.10.0001');
  const [dataAjuizamento, setDataAjuizamento] = useState('2024-02-10');
  const [afastarPrescricao, setAfastarPrescricao] = useState(false);
  const [autorNome, setAutorNome] = useState('Carlos Eduardo Oliveira');
  const [autorCpf, setAutorCpf] = useState('284.910.488-15');
  const [percentualAcordo, setPercentualAcordo] = useState<number>(100);

  // Etapa 3, 4, 5, 6, 7 — Critérios de Atualização, Data-Base, Juros & SELIC
  const [criterioCorrecao, setCriterioCorrecao] = useState<'manual_jf_2022' | 'inpc' | 'ipca_e' | 'igp_di'>('manual_jf_2022');
  const [databaseAtualizacao, setDatabaseAtualizacao] = useState('2026-09');
  const [criterioJuros, setCriterioJuros] = useState<'sem_juros' | 'selic' | '1pct_simples' | '05pct_poupanca' | 'manual_jf_2022'>('manual_jf_2022');
  const [dataInicioJuros, setDataInicioJuros] = useState('2024-02');
  const [aplicarSelicEc113, setAplicarSelicEc113] = useState(true);

  // Etapa 8, 9, 10, 11, 12 — Dados do Benefício Devido (RMI, DIB, DDA, Período Executado)
  const [tipoOperacao, setTipoOperacao] = useState<'concessao' | 'restabelecimento'>('concessao');
  const [especieBeneficio, setEspecieBeneficio] = useState('Aposentadoria por Idade Urbana (B41)');
  const [rmi, setRmi] = useState<number>(1518);
  const [dib, setDib] = useState('2023-01-01');
  const [dibAnteriorDda, setDibAnteriorDda] = useState('');
  const [dataInicialParcelas, setDataInicialParcelas] = useState('2023-01-01');
  const [dataFinalParcelas, setDataFinalParcelas] = useState('2026-08-31');

  // Etapa 15 — 13º Salário
  const [abono13ApurarAutomatico, setAbono13ApurarAutomatico] = useState(true);
  const [abono13ProporcionalUltimoAno, setAbono13ProporcionalUltimoAno] = useState(true);

  // Etapa 16 — Benefícios Recebidos
  const [beneficiosRecebidos, setBeneficiosRecebidos] = useState<Array<{ competencia: string; valor: number; obs?: string }>>([]);
  const [novoRecComp, setNovoRecComp] = useState('');
  const [novoRecValor, setNovoRecValor] = useState<number>(0);

  // Etapa 17 — Outros Créditos / Descontos
  const [outrosCreditosDescontos, setOutrosCreditosDescontos] = useState<Array<{ competencia: string; tipo: 'credito' | 'desconto'; valor: number; obs?: string }>>([]);

  // Etapa 20, 21 — Honorários
  const [honorariosContratuaisPct, setHonorariosContratuaisPct] = useState<number>(20);
  const [honorariosSucumbenciaisPct, setHonorariosSucumbenciaisPct] = useState<number>(15);

  // UI States
  const [showMemoriaCompleta, setShowMemoriaCompleta] = useState(true);
  const [copied, setCopied] = useState(false);

  // Selecionar processo cadastrado para preencher dados
  const handleSelecionarProcessoExistente = (procId: string) => {
    const p = processos.find(x => x.id === procId);
    if (p) {
      setNumeroProcesso(p.numeroCnj);
      setAutorNome(p.clienteNome);
      setDataAjuizamento(p.dataDistribuicao);
      if (p.numeroBeneficioInss) {
        setEspecieBeneficio(p.temaPrevidenciario || 'Aposentadoria por Idade Urbana (B41)');
      }
    }
  };

  // Executar motor de cálculo determinístico
  const resultado: ResultadoLiquidaPrev = useMemo(() => {
    const params: ParametrosLiquidaPrev = {
      tipoCalculo,
      numeroProcesso,
      dataAjuizamento,
      afastarPrescricao,
      autorNome,
      autorCpf,
      percentualAcordo,
      criterioCorrecao,
      databaseAtualizacao,
      criterioJuros,
      dataInicioJuros,
      aplicarSelicEc113,
      tipoOperacao,
      especieBeneficio,
      rmi,
      dib,
      dibAnteriorDda,
      dataInicialParcelas,
      dataFinalParcelas,
      abono13ApurarAutomatico,
      abono13ProporcionalUltimoAno,
      beneficiosRecebidos,
      outrosCreditosDescontos,
      honorariosContratuaisPct,
      honorariosSucumbenciaisPct
    };

    return calcularLiquidaPrev(params);
  }, [
    tipoCalculo,
    numeroProcesso,
    dataAjuizamento,
    afastarPrescricao,
    autorNome,
    autorCpf,
    percentualAcordo,
    criterioCorrecao,
    databaseAtualizacao,
    criterioJuros,
    dataInicioJuros,
    aplicarSelicEc113,
    tipoOperacao,
    especieBeneficio,
    rmi,
    dib,
    dibAnteriorDda,
    dataInicialParcelas,
    dataFinalParcelas,
    abono13ApurarAutomatico,
    abono13ProporcionalUltimoAno,
    beneficiosRecebidos,
    outrosCreditosDescontos,
    honorariosContratuaisPct,
    honorariosSucumbenciaisPct
  ]);

  const fmt = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleAddBeneficioRecebido = () => {
    if (!novoRecComp || novoRecValor <= 0) {
      alert('Informe uma competência válida (AAAA-MM) e um valor maior que zero.');
      return;
    }
    setBeneficiosRecebidos(prev => [...prev, { competencia: novoRecComp, valor: novoRecValor }]);
    setNovoRecComp('');
    setNovoRecValor(0);
  };

  const handleRemoveBeneficioRecebido = (index: number) => {
    setBeneficiosRecebidos(prev => prev.filter((_, i) => i !== index));
  };

  // Gerar Impressão / PDF Oficial da Memória de Cálculo
  const handleImprimirPdf = () => {
    const win = window.open('', '_blank');
    if (!win) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Memória de Cálculo Previdenciária - Conta Fácil Prev / BJuris</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #1e293b; margin: 20px; }
          h1 { font-size: 18px; text-transform: uppercase; margin-bottom: 2px; color: #0f172a; }
          .sub { font-size: 11px; color: #64748b; margin-bottom: 15px; font-weight: bold; }
          .box { border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px; margin-bottom: 15px; background: #f8fafc; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }
          th { background: #0f172a; color: white; padding: 6px; text-align: right; text-transform: uppercase; font-size: 9px; }
          th:first-child, td:first-child { text-align: left; }
          td { border-bottom: 1px solid #e2e8f0; padding: 5px; text-align: right; font-family: monospace; }
          .totais { background: #f1f5f9; font-weight: bold; border-top: 2px solid #0f172a; }
          .highlight { background: #fef3c7; color: #92400e; padding: 8px; border-radius: 6px; font-weight: bold; margin-top: 15px; }
        </style>
      </head>
      <body>
        <h1>PODER JUDICIÁRIO — JUSTIÇA FEDERAL</h1>
        <div class="sub">LIQUIDAÇÃO DE SENTENÇA PREVIDENCIÁRIA — MANUAL DE CÁLCULOS DA JF (EDIÇÃO 2022)</div>

        <div class="box">
          <div class="grid">
            <div><strong>Nº Processo CNJ:</strong> ${numeroProcesso}</div>
            <div><strong>Autor / Beneficiário:</strong> ${autorNome} (${autorCpf})</div>
            <div><strong>Ajuizamento:</strong> ${dataAjuizamento}</div>
            <div><strong>Espécie Benefício:</strong> ${especieBeneficio}</div>
            <div><strong>RMI Inicial:</strong> ${fmt(rmi)}</div>
            <div><strong>DIB / DDA:</strong> ${dib}</div>
            <div><strong>Período Executado:</strong> ${dataInicialParcelas} a ${dataFinalParcelas}</div>
            <div><strong>Critério Atualização:</strong> ${criterioCorrecao === 'manual_jf_2022' ? 'Manual de Cálculos da JF (Edição 2022) + EC 113/21' : criterioCorrecao.toUpperCase()}</div>
            <div><strong>Data-Base Atualização:</strong> ${databaseAtualizacao}</div>
          </div>
        </div>

        <h3>MEMÓRIA MENSAL COMPETÊNCIA POR COMPETÊNCIA</h3>
        <table>
          <thead>
            <tr>
              <th>Competência</th>
              <th>Renda Mensal</th>
              <th>Devido (Bruto)</th>
              <th>Recebido</th>
              <th>Diferença Hist.</th>
              <th>Índice / Coef.</th>
              <th>Corrigido</th>
              <th>Juros / SELIC</th>
              <th>Total Atualizado</th>
            </tr>
          </thead>
          <tbody>
            ${resultado.linhasMemoria.map(l => `
              <tr>
                <td>${l.competencia}</td>
                <td>${fmt(l.rendaMensalEvoluida)}</td>
                <td>${fmt(l.valorDevidoTotal)}</td>
                <td>${fmt(l.valorRecebidoCompensado)}</td>
                <td>${fmt(l.diferencaHistorica)}</td>
                <td>${l.nomeIndiceCorrecao} (${l.fatorCorrecao})</td>
                <td>${fmt(l.valorCorrigido)}</td>
                <td>${l.valorSelic > 0 ? `SELIC (${l.percentualSelic}%)` : `Juros (${l.percentualJurosMora}%)`}</td>
                <td><strong>${fmt(l.totalCompetenciaAtualizado)}</strong></td>
              </tr>
            `).join('')}
            <tr class="totais">
              <td>TOTAIS CONSOLIDADOS</td>
              <td>-</td>
              <td>${fmt(resultado.totalHistoricoDevido)}</td>
              <td>${fmt(resultado.totalHistoricoRecebido)}</td>
              <td>${fmt(resultado.diferencaHistoricaLiquida)}</td>
              <td>-</td>
              <td>${fmt(resultado.totalHistoricoDevido + resultado.totalCorrecaoMonetaria)}</td>
              <td>${fmt(resultado.totalJurosMora + resultado.totalSelic)}</td>
              <td>${fmt(resultado.totalBrutoAtualizado)}</td>
            </tr>
          </tbody>
        </table>

        <div class="box" style="margin-top: 15px;">
          <h3>RESUMO FINANCEIRO FINAL</h3>
          <div class="grid">
            <div>Principal Histórico: <strong>${fmt(resultado.diferencaHistoricaLiquida)}</strong></div>
            <div>Correção Monetária: <strong>+${fmt(resultado.totalCorrecaoMonetaria)}</strong></div>
            <div>Juros de Mora / SELIC: <strong>+${fmt(resultado.totalJurosMora + resultado.totalSelic)}</strong></div>
            <div><strong>TOTAL BRUTO ATUALIZADO:</strong> ${fmt(resultado.totalBrutoAtualizado)}</div>
            <div>Honorários Contratuais (${honorariosContratuaisPct}%): <strong>${fmt(resultado.honorariosContratuaisValor)}</strong></div>
            <div><strong>LÍQUIDO PARA O CLIENTE:</strong> ${fmt(resultado.totalLiquidoCliente)}</div>
            <div>Honorários Sucumbenciais (${honorariosSucumbenciaisPct}%): <strong>${fmt(resultado.honorariosSucumbenciaisValor)}</strong></div>
            <div><strong>FORMA DE PAGAMENTO:</strong> ${resultado.isRpv ? 'RPV (Requisição de Pequeno Valor)' : 'PRECATÓRIO FEDERAL'}</div>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    win.document.write(htmlContent);
    win.document.close();
  };

  const handleCopyResumo = () => {
    const texto = [
      '=== MEMÓRIA SINTÉTICA DE LIQUIDAÇÃO PREVIDENCIÁRIA ===',
      `Processo CNJ: ${numeroProcesso}`,
      `Autor: ${autorNome}`,
      `Espécie: ${especieBeneficio} | RMI: ${fmt(rmi)} | DIB: ${dib}`,
      `Período Executado: ${dataInicialParcelas} a ${dataFinalParcelas}`,
      `Critério: Manual de Cálculos da Justiça Federal (Edição 2022) | Data-Base: ${databaseAtualizacao}`,
      `--------------------------------------------------`,
      `Total Histórico Devido: ${fmt(resultado.totalHistoricoDevido)}`,
      `(-) Benefícios Recebidos: ${fmt(resultado.totalHistoricoRecebido)}`,
      `Principal Líquido: ${fmt(resultado.diferencaHistoricaLiquida)}`,
      `(+) Correção Monetária: ${fmt(resultado.totalCorrecaoMonetaria)}`,
      `(+) Juros Mora / SELIC (EC 113/21): ${fmt(resultado.totalJurosMora + resultado.totalSelic)}`,
      `TOTAL BRUTO ATUALIZADO: ${fmt(resultado.totalBrutoAtualizado)}`,
      `(-) Honorários Contratuais (${honorariosContratuaisPct}%): ${fmt(resultado.honorariosContratuaisValor)}`,
      `VALOR LÍQUIDO DO CLIENTE: ${fmt(resultado.totalLiquidoCliente)}`,
      `Honorários Sucumbenciais (${honorariosSucumbenciaisPct}%): ${fmt(resultado.honorariosSucumbenciaisValor)}`,
      `FORMA DE REQUISIÇÃO: ${resultado.isRpv ? 'RPV (< 60 SM)' : 'Precatório Federal (> 60 SM)'} (${resultado.salariosMinimosEquivalentes} SM)`,
    ].join('\n');

    navigator.clipboard.writeText(texto).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full text-slate-900">

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/50 shadow-2xl text-white relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-[#d4af37] font-black text-xs border border-amber-500/40 uppercase tracking-widest flex items-center gap-1.5">
                <Gavel className="w-4 h-4 text-amber-400" />
                CONTA FÁCIL PREV — JUSTIÇA FEDERAL
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-500/40 uppercase">
                Edição Manual JF 2022 & EC 113/21
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-slate-100 tracking-wide">
              Calculadora Previdenciária — Liquidação de Sentença
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-medium">
              Evolução mensal da RMI, apuração de 13º abono, dedução de benefícios compensáveis, aplicação de correção monetária histórica, juros de mora e regime de <strong className="text-amber-400 font-bold">SELIC a partir de 12/2021</strong>.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={handleImprimirPdf}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-amber-600" />
              📄 Gerar Memória em PDF
            </button>
          </div>
        </div>
      </div>

      {/* ETAPA 1 — TIPO DE CÁLCULO (Tabs) */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
        <button
          type="button"
          onClick={() => setTipoCalculo('liquidacao')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            tipoCalculo === 'liquidacao'
              ? 'btn-gold-3d shadow-md'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Gavel className="w-4 h-4 text-amber-700" />
          ○ Cálculo de Liquidação de Sentença
        </button>

        <button
          type="button"
          onClick={() => setTipoCalculo('valor_causa')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            tipoCalculo === 'valor_causa'
              ? 'btn-gold-3d shadow-md'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-4 h-4 text-blue-600" />
          ○ Cálculo do Valor da Causa (Vencidas + 12 Vincendas)
        </button>
      </div>

      {/* Main Grid: Inputs (3 cols) vs Outputs (2 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* ── PAINEL ESQUERDO: PARÂMETROS E ENTRADAS (3 COLUNAS) ────────────────── */}
        <div className="xl:col-span-3 space-y-5">

          {/* ETAPA 2 — DADOS DO PROCESSO */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Etapa 2 — Dados do Processo & Partes
              </h3>
              
              {processos.length > 0 && (
                <select
                  onChange={e => handleSelecionarProcessoExistente(e.target.value)}
                  className="bg-amber-50 border border-amber-300 rounded-xl px-2.5 py-1 text-xs text-amber-900 font-bold focus:outline-none"
                >
                  <option value="">Importar de Processo Cadastrado...</option>
                  {processos.map(p => (
                    <option key={p.id} value={p.id}>{p.numeroCnj} - {p.clienteNome}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">Nº do Processo (CNJ)</label>
                <input
                  type="text"
                  value={numeroProcesso}
                  onChange={e => setNumeroProcesso(e.target.value)}
                  placeholder="0000000-00.2024.4.01.0000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">Data de Ajuizamento</label>
                <input
                  type="date"
                  value={dataAjuizamento}
                  onChange={e => setDataAjuizamento(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">Percentual do Acordo (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={percentualAcordo}
                  onChange={e => setPercentualAcordo(parseFloat(e.target.value) || 100)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">Nome do Autor / Beneficiário</label>
                <input
                  type="text"
                  value={autorNome}
                  onChange={e => setAutorNome(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">CPF do Autor</label>
                <input
                  type="text"
                  value={autorCpf}
                  onChange={e => setAutorCpf(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="afastarPrescricaoCheck"
                checked={afastarPrescricao}
                onChange={e => setAfastarPrescricao(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
              />
              <label htmlFor="afastarPrescricaoCheck" className="text-xs font-extrabold text-slate-800 cursor-pointer">
                ☐ Afastar prescrição quinquenal (executar parcelas anteriores aos 5 anos do ajuizamento)
              </label>
            </div>
          </div>

          {/* ETAPAS 3, 4, 5, 6, 7 — CRITÉRIOS DE ATUALIZAÇÃO, JUROS & SELIC */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Etapas 3 a 7 — Critérios de Atualização Monetária, Juros & SELIC
            </h3>

            {/* Seleção do Critério Principal */}
            <div>
              <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                Cadeia de Correção Monetária Principal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCriterioCorrecao('manual_jf_2022');
                    setCriterioJuros('manual_jf_2022');
                    setAplicarSelicEc113(true);
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    criterioCorrecao === 'manual_jf_2022'
                      ? 'bg-gradient-to-r from-blue-900 to-slate-900 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                      : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <strong className="text-xs font-black block">Benefícios Previdenciários — Manual de Cálculos da JF (Edição 2022)</strong>
                  <span className="text-[10px] opacity-80 block mt-0.5">
                    ORTN → OTN → IPC → BTN → INPC → IRSM → URV → IPC-R → IGP-DI → INPC → SELIC (12/2021+)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCriterioCorrecao('inpc')}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    criterioCorrecao === 'inpc'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <strong className="text-xs font-black block">INPC Exclusivo (Art. 41-A Lei 8.213/91)</strong>
                  <span className="text-[10px] opacity-80 block mt-0.5">
                    Índice Nacional de Preços ao Consumidor direto para benefícios previdenciários
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">Data-Base de Atualização (MM/AAAA)</label>
                <input
                  type="month"
                  value={databaseAtualizacao}
                  onChange={e => setDatabaseAtualizacao(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">Juros Moratórios</label>
                <select
                  value={criterioJuros}
                  onChange={e => setCriterioJuros(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                >
                  <option value="manual_jf_2022">Manual da JF 2022 (0,5% a.m. até 11/2021 + SELIC)</option>
                  <option value="1pct_simples">1% a.m. Simples (Cível Geral)</option>
                  <option value="05pct_poupanca">0,5% a.m. (Caderneta de Poupança / Art. 1º-F Lei 9.494)</option>
                  <option value="selic">Taxa SELIC Exclusiva</option>
                  <option value="sem_juros">Sem Juros de Mora</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">Data Início dos Juros (MM/AAAA)</label>
                <input
                  type="month"
                  value={dataInicioJuros}
                  onChange={e => setDataInicioJuros(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="selicCheck"
                  checked={aplicarSelicEc113}
                  onChange={e => setAplicarSelicEc113(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <label htmlFor="selicCheck" className="text-xs font-black text-amber-900 cursor-pointer">
                  ☑ Aplicar SELIC a partir de 12/2021 (Emenda Constitucional 113/2021)
                </label>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-200 text-amber-900 uppercase">
                Sem dupla incidência
              </span>
            </div>
          </div>

          {/* ETAPAS 8 a 14 — DADOS DO BENEFÍCIO DEVIDO & EVOLUÇÃO DA RENDA */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calculator className="w-4 h-4 text-amber-600" />
              Etapas 8 a 14 — Benefício Devido, RMI & Período Executado
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">Tipo de Operação</label>
                <select
                  value={tipoOperacao}
                  onChange={e => setTipoOperacao(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                >
                  <option value="concessao">○ Concessão de Benefício Previdenciário</option>
                  <option value="restabelecimento">○ Restabelecimento de Benefício Cessado/Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">Espécie do Benefício Previdenciário</label>
                <select
                  value={especieBeneficio}
                  onChange={e => setEspecieBeneficio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                >
                  <option value="Aposentadoria por Idade Urbana (B41)">Aposentadoria por Idade Urbana (B41)</option>
                  <option value="Aposentadoria por Idade Rural (B41)">Aposentadoria por Idade Rural (B41)</option>
                  <option value="Aposentadoria por Tempo de Contribuição (B42)">Aposentadoria por Tempo de Contribuição (B42)</option>
                  <option value="Aposentadoria Especial (B46)">Aposentadoria Especial (B46)</option>
                  <option value="Aposentadoria por Incapacidade Permanente (Invalidez B32)">Aposentadoria por Incapacidade Permanente (Invalidez B32)</option>
                  <option value="Auxílio por Incapacidade Temporária (Auxílio-Doença B31)">Auxílio por Incapacidade Temporária (Auxílio-Doença B31)</option>
                  <option value="Benefício de Prestação Continuada — BPC/LOAS Idoso (B88)">BPC/LOAS Idoso (B88)</option>
                  <option value="Benefício de Prestação Continuada — BPC/LOAS Deficiência (B87)">BPC/LOAS Deficiência (B87)</option>
                  <option value="Pensão por Morte Urbana/Rural (B21)">Pensão por Morte Urbana/Rural (B21)</option>
                  <option value="Auxílio-Acidente (B36)">Auxílio-Acidente (B36)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">RMI — Renda Mensal Inicial (R$)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={rmi}
                  onChange={e => setRmi(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-black font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">DIB — Data Início do Benefício</label>
                <input
                  type="date"
                  value={dib}
                  onChange={e => setDib(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">DIB Anterior / DDA (Opcional)</label>
                <input
                  type="date"
                  value={dibAnteriorDda}
                  onChange={e => setDibAnteriorDda(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">Data Inicial das Parcelas Executadas</label>
                <input
                  type="date"
                  value={dataInicialParcelas}
                  onChange={e => setDataInicialParcelas(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">Data Final das Parcelas Executadas</label>
                <input
                  type="date"
                  value={dataFinalParcelas}
                  onChange={e => setDataFinalParcelas(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ETAPA 15 — 13º SALÁRIO */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4 h-4 text-purple-600" />
              Etapa 15 — Controles do 13º Salário (Abono Anual)
            </h3>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="abono13AutoCheck"
                  checked={abono13ApurarAutomatico}
                  onChange={e => setAbono13ApurarAutomatico(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                />
                <label htmlFor="abono13AutoCheck" className="text-xs font-bold text-slate-900 cursor-pointer">
                  Apurar 13º salário automaticamente
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="abono13UltimoAnoCheck"
                  checked={abono13ProporcionalUltimoAno}
                  onChange={e => setAbono13ProporcionalUltimoAno(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                />
                <label htmlFor="abono13UltimoAnoCheck" className="text-xs font-bold text-slate-900 cursor-pointer">
                  Incluir proporcional no último ano
                </label>
              </div>
            </div>
          </div>

          {/* ETAPAS 16 & 17 — BENEFÍCIOS RECEBIDOS & OUTROS CRÉDITOS */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Plus className="w-4 h-4 text-emerald-600" />
              Etapas 16 & 17 — Benefícios Recebidos & Deduções Compensáveis
            </h3>

            <div className="flex flex-col sm:flex-row items-end gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase">Competência (AAAA-MM)</label>
                <input
                  type="month"
                  value={novoRecComp}
                  onChange={e => setNovoRecComp(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex-1 w-full">
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase">Valor Recebido (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={novoRecValor}
                  onChange={e => setNovoRecValor(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAddBeneficioRecebido}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-1 shadow"
              >
                <Plus className="w-4 h-4" />
                + Adicionar Benefício Recebido
              </button>
            </div>

            {beneficiosRecebidos.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                  Benefícios / Pagamentos Compensáveis Cadastrados:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {beneficiosRecebidos.map((b, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 font-mono font-bold">{b.competencia}:</strong> <span className="text-emerald-800 font-bold">{fmt(b.valor)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBeneficioRecebido(idx)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ETAPAS 20 & 21 — HONORÁRIOS CONTRATUAIS E SUCUMBENCIAIS */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Gavel className="w-4 h-4 text-emerald-600" />
              Etapas 20 & 21 — Honorários Advocatícios
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">
                  Honorários Contratuais (% sobre o acordo)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={honorariosContratuaisPct}
                    onChange={e => setHonorariosContratuaisPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-xs font-black text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">
                  Honorários Sucumbenciais (% fixado pelo juízo)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={honorariosSucumbenciaisPct}
                    onChange={e => setHonorariosSucumbenciaisPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-xs font-black text-slate-400">%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── PAINEL DIREITO: RESUMO E MEMÓRIA DE CÁLCULO (2 COLUNAS) ────────────── */}
        <div className="xl:col-span-2 space-y-5">

          {/* Card Resumo da Liquidação de Sentença */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-amber-500/40 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Resumo Consolidado do Cálculo
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                DB: {databaseAtualizacao}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Total Histórico Devido</span>
                <span className="font-mono font-black text-slate-200">{fmt(resultado.totalHistoricoDevido)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">(-) Benefícios Recebidos / Descontos</span>
                <span className="font-mono font-black text-red-400">−{fmt(resultado.totalHistoricoRecebido)}</span>
              </div>

              <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                <span className="font-bold text-slate-300">Principal Histórico Líquido</span>
                <span className="font-mono font-black text-slate-100">{fmt(resultado.diferencaHistoricaLiquida)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-semibold">+ Correção Monetária (Manual JF 2022)</span>
                <span className="font-mono font-black text-blue-300">+{fmt(resultado.totalCorrecaoMonetaria)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-semibold">+ Juros de Mora / SELIC (EC 113/21)</span>
                <span className="font-mono font-black text-purple-300">+{fmt(resultado.totalJurosMora + resultado.totalSelic)}</span>
              </div>

              <div className="border-t border-amber-500/40 pt-3 flex items-center justify-between">
                <span className="text-sm font-black text-white">TOTAL BRUTO ATUALIZADO</span>
                <span className="text-xl font-black font-mono text-amber-400">{fmt(resultado.totalBrutoAtualizado)}</span>
              </div>

              {honorariosContratuaisPct > 0 && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400 font-medium">− Honorários Contratuais ({honorariosContratuaisPct}%)</span>
                  <span className="font-mono font-black text-red-400">−{fmt(resultado.honorariosContratuaisValor)}</span>
                </div>
              )}

              <div className="border-t border-emerald-500/40 pt-3 flex items-center justify-between bg-emerald-950/30 p-3 rounded-2xl border border-emerald-500/30">
                <span className="text-xs font-black text-emerald-300">LÍQUIDO PARA O CLIENTE</span>
                <span className="text-xl font-black font-mono text-emerald-400">{fmt(resultado.totalLiquidoCliente)}</span>
              </div>

              {honorariosSucumbenciaisPct > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-medium">Honorários Sucumbenciais ({honorariosSucumbenciaisPct}%)</span>
                  <span className="font-mono font-black text-amber-300">{fmt(resultado.honorariosSucumbenciaisValor)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card RPV / Precatório Federal */}
          <div className={`p-5 rounded-2xl border text-center space-y-2 ${
            resultado.isRpv
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-purple-50 border-purple-300 text-purple-950'
          }`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 block">Forma de Pagamento na Justiça Federal</span>
            <h4 className="text-base font-black uppercase">
              {resultado.isRpv ? 'RPV — Requisição de Pequeno Valor' : 'PRECATÓRIO FEDERAL'}
            </h4>
            <p className="text-xs font-black font-mono">
              {resultado.salariosMinimosEquivalentes} salários mínimos
              {resultado.isRpv ? ' (Abaixo do limite de 60 SM)' : ' (Acima do limite de 60 SM)'}
            </p>
          </div>

          {/* Botões de Cópia e Impressão */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleImprimirPdf}
              className="w-full py-3.5 rounded-2xl btn-gold-3d text-xs font-black shadow-lg flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              📄 Imprimir Memória Completa / Salvar PDF
            </button>

            <button
              type="button"
              onClick={handleCopyResumo}
              className={`w-full py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all border ${
                copied
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado com sucesso!' : 'Copiar Resumo em Texto'}
            </button>
          </div>

        </div>

      </div>

      {/* ── ETAPAS 18 & 23 — TABELA COMPLETA DA MEMÓRIA DE CÁLCULO MENSAL ─────────── */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              Etapas 18 & 23 — Memória Mensal Competência por Competência ({resultado.linhasMemoria.length} parcelas)
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Demonstrativo minucioso de cada competência para conferência e juntada aos autos judiciais.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowMemoriaCompleta(!showMemoriaCompleta)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-300"
          >
            {showMemoriaCompleta ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showMemoriaCompleta ? 'Ocultar Tabela' : 'Exibir Tabela Completa'}
          </button>
        </div>

        {showMemoriaCompleta && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-900 text-white font-black uppercase text-[10px]">
                  <th className="p-3 rounded-l-xl">Comp.</th>
                  <th className="p-3">Renda Evoluída</th>
                  <th className="p-3">Devido (Bruto)</th>
                  <th className="p-3">Recebido</th>
                  <th className="p-3">Diferença Hist.</th>
                  <th className="p-3">Índice / Fator</th>
                  <th className="p-3">Corrigido</th>
                  <th className="p-3">Juros / SELIC</th>
                  <th className="p-3 rounded-r-xl text-right">Total Atualizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {resultado.linhasMemoria.map(l => (
                  <tr key={l.competencia} className="hover:bg-amber-50/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{l.competencia}</td>
                    <td className="p-3 font-mono text-slate-700">{fmt(l.rendaMensalEvoluida)}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{fmt(l.valorDevidoTotal)}</td>
                    <td className="p-3 font-mono text-red-600">{l.valorRecebidoCompensado > 0 ? `-${fmt(l.valorRecebidoCompensado)}` : '-'}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{fmt(l.diferencaHistorica)}</td>
                    <td className="p-3 text-[11px] text-slate-600">
                      <span className="font-bold">{l.nomeIndiceCorrecao}</span> ({l.fatorCorrecao})
                    </td>
                    <td className="p-3 font-mono text-blue-700 font-bold">{fmt(l.valorCorrigido)}</td>
                    <td className="p-3 font-mono text-purple-700 font-bold">
                      {l.valorSelic > 0 ? `SELIC (${l.percentualSelic}%)` : `+${fmt(l.valorJurosMora)}`}
                    </td>
                    <td className="p-3 font-mono text-right font-black text-amber-900">{fmt(l.totalCompetenciaAtualizado)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-amber-100/70 font-black text-slate-900 border-t-2 border-amber-400">
                  <td className="p-3">TOTAL:</td>
                  <td className="p-3">-</td>
                  <td className="p-3 font-mono">{fmt(resultado.totalHistoricoDevido)}</td>
                  <td className="p-3 font-mono text-red-700">-{fmt(resultado.totalHistoricoRecebido)}</td>
                  <td className="p-3 font-mono">{fmt(resultado.diferencaHistoricaLiquida)}</td>
                  <td className="p-3">-</td>
                  <td className="p-3 font-mono text-blue-900">{fmt(resultado.totalHistoricoDevido + resultado.totalCorrecaoMonetaria)}</td>
                  <td className="p-3 font-mono text-purple-900">{fmt(resultado.totalJurosMora + resultado.totalSelic)}</td>
                  <td className="p-3 font-mono text-right text-base text-amber-950">{fmt(resultado.totalBrutoAtualizado)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
