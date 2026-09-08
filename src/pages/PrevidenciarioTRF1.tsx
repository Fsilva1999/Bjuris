import React, { useState, useMemo } from 'react';
import { useLegal } from '../context/LegalContext';
import { CalculadoraLiquidaPrev } from '../components/previdenciario/CalculadoraLiquidaPrev';
import {
  ShieldCheck,
  Calculator,
  Scale,
  Plus,
  ExternalLink,
  Users,
  Building,
  TrendingUp,
  Gavel,
  AlertCircle,
  Copy,
  CheckCircle2
} from 'lucide-react';

export const LISTA_SUBSECOES_TRF1 = [
  { uf: 'DF', nome: 'SJDF — Seção Judiciária do Distrito Federal (Brasília)' },
  { uf: 'MA', nome: 'SJMA — Seção Judiciária do Maranhão (São Luís, Imperatriz, Caxias)' },
  { uf: 'MG', nome: 'SJMG — Seção Judiciária de Minas Gerais (Belo Horizonte, Uberlândia)' },
  { uf: 'GO', nome: 'SJGO — Seção Judiciária de Goiás (Goiânia, Anápolis)' },
  { uf: 'BA', nome: 'SJBA — Seção Judiciária da Bahia (Salvador, Feira de Santana)' },
  { uf: 'PA', nome: 'SJPA — Seção Judiciária do Pará (Belém, Santarém)' },
  { uf: 'PI', nome: 'SJPI — Seção Judiciária do Piauí (Teresina, Picos)' },
  { uf: 'AM', nome: 'SJAM — Seção Judiciária do Amazonas (Manaus)' },
  { uf: 'MT', nome: 'SJMT — Seção Judiciária de Mato Grosso (Cuiabá)' },
  { uf: 'RO', nome: 'SJRO — Seção Judiciária de Rondônia (Porto Velho)' },
  { uf: 'RR', nome: 'SJRR — Seção Judiciária de Roraima (Boa Vista)' },
  { uf: 'AP', nome: 'SJAP — Seção Judiciária do Amapá (Macapá)' },
  { uf: 'TO', nome: 'SJTO — Seção Judiciária de Tocantins (Palmas)' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export const PrevidenciarioTRF1: React.FC = () => {
  const { clientes, processos, setModalState } = useLegal();

  const [activeSubTab, setActiveSubTab] = useState<'calculadora' | 'subsecoes' | 'beneficiarios'>('calculadora');
  const [copied, setCopied] = useState(false);

  // ── Calculadora: Valor da Causa + Liquidação de Sentença ──────────────────
  const SAL_MIN = 1518; // Salário mínimo 2026
  const LIMITE_RPV = SAL_MIN * 60; // R$ 91.080,00

  // Dados do benefício
  const [rmiCalc, setRmiCalc] = useState<number>(1518);         // RMI mensal (R$)
  const [derStr, setDerStr] = useState<string>('2023-01-01');   // DER - Data de Entrada do Requerimento
  const [dipStr, setDipStr] = useState<string>(new Date().toISOString().slice(0, 10)); // DIP - Data Início Pagamento

  // Correção e juros
  const [indiceCorrecao, setIndiceCorrecao] = useState<'ipca_e' | 'inpc'>('ipca_e');
  const [percCorrecao, setPercCorrecao] = useState<number>(28.5);  // % acumulado estimado (editável)
  const [tipoJuros, setTipoJuros] = useState<'selic' | '1pct'>('selic');
  const [percJuros, setPercJuros] = useState<number>(12.5);         // % juros total estimado (editável)

  // Honorários
  const [percHonorarios, setPercHonorarios] = useState<number>(20); // %

  // ── Cálculos derivados ────────────────────────────────────────────────────
  const calculos = useMemo(() => {
    const der = new Date(derStr + 'T00:00:00');
    const dip = new Date(dipStr + 'T00:00:00');
    if (isNaN(der.getTime()) || isNaN(dip.getTime()) || dip <= der) {
      return null;
    }

    // Meses entre DER e DIP
    const diffMs = dip.getTime() - der.getTime();
    const mesesAtrasados = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44));

    // Parcelas vencidas brutas
    const parcelasBrutas = mesesAtrasados * rmiCalc;

    // Valor da Causa = parcelas vencidas + 12 competências futuras
    const valorCausa = parcelasBrutas + (12 * rmiCalc);

    // Correção monetária sobre parcelas vencidas
    const correcaoValor = parcelasBrutas * (percCorrecao / 100);
    const comCorrecao = parcelasBrutas + correcaoValor;

    // Juros de mora sobre (principal + correção)
    const jurosValor = comCorrecao * (percJuros / 100);
    const totalAtrasados = comCorrecao + jurosValor;

    // Honorários advocatícios
    const honorarios = totalAtrasados * (percHonorarios / 100);

    // Total líquido cliente
    const totalLiquidoCliente = totalAtrasados - honorarios;

    // RPV ou Precatório
    const isRpv = totalAtrasados <= LIMITE_RPV;
    const smEquiv = totalAtrasados / SAL_MIN;

    return {
      mesesAtrasados,
      parcelasBrutas,
      valorCausa,
      correcaoValor,
      comCorrecao,
      jurosValor,
      totalAtrasados,
      honorarios,
      totalLiquidoCliente,
      isRpv,
      smEquiv,
    };
  }, [rmiCalc, derStr, dipStr, percCorrecao, percJuros, percHonorarios]);

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleCopyResultado = () => {
    if (!calculos) return;
    const texto = [
      '=== CÁLCULO PREVIDENCIÁRIO ===',
      `RMI: ${fmt(rmiCalc)}`,
      `Período: ${derStr} a ${dipStr} (${calculos.mesesAtrasados} meses)`,
      `Parcelas vencidas (bruto): ${fmt(calculos.parcelasBrutas)}`,
      `Correção monetária (${indiceCorrecao.toUpperCase()} ${percCorrecao}%): ${fmt(calculos.correcaoValor)}`,
      `Juros de mora (${tipoJuros === 'selic' ? 'Selic' : '1% a.m.'} ${percJuros}%): ${fmt(calculos.jurosValor)}`,
      `Total atrasados: ${fmt(calculos.totalAtrasados)}`,
      `Honorários (${percHonorarios}%): ${fmt(calculos.honorarios)}`,
      `Líquido para o cliente: ${fmt(calculos.totalLiquidoCliente)}`,
      `Valor da Causa: ${fmt(calculos.valorCausa)}`,
      `Forma de pagamento: ${calculos.isRpv ? 'RPV' : 'Precatório Federal'}`,
    ].join('\n');
    navigator.clipboard.writeText(texto).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-[#d4af37] font-black text-xs border border-amber-500/40 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Modulo Especializado Previdenciario
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-500/40 uppercase">
                Civel & Trabalhista
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-slate-100 tracking-wide">
              Gestao Previdenciaria & Jurisdicao
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Sistema otimizado para <strong className="text-amber-400 font-bold">Acoes de BPC/LOAS</strong>, Concessoes de Aposentadoria (Urbana e Rural / Segurado Especial), Beneficios por Incapacidade INSS e Requisicoes de Pagamento (<strong className="text-amber-300">RPV & Precatorios Federais</strong>).
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => setModalState(prev => ({ ...prev, novoProcesso: true }))}
              className="w-full sm:w-auto px-5 py-3 rounded-xl btn-gold-3d text-xs font-black transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              Novo Processo Federal / INSS
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('calculadora')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 flex-shrink-0 ${
            activeSubTab === 'calculadora'
              ? 'btn-gold-3d shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Calculadora de Beneficios & RPV
        </button>

        <button
          onClick={() => setActiveSubTab('subsecoes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 flex-shrink-0 ${
            activeSubTab === 'subsecoes'
              ? 'btn-gold-3d shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
          }`}
        >
          <Building className="w-4 h-4 text-blue-600" />
          Secoes Judiciarias
        </button>

        <button
          onClick={() => setActiveSubTab('beneficiarios')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 flex-shrink-0 ${
            activeSubTab === 'beneficiarios'
              ? 'btn-gold-3d shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          Clientes & NBs Cadastrados ({clientes.length})
        </button>
      </div>

      {/* ─── TAB: CALCULADORA ──────────────────────────────────────────────────── */}
      {activeSubTab === 'calculadora' && (
        <CalculadoraLiquidaPrev />
      )}

      {/* ─── TAB: SECOES JUDICIARIAS ─────────────────────────────────────────────── */}
      {activeSubTab === 'subsecoes' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-panel bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Jurisdicao da Justica Federal
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Secoes e Subsecoes Judiciarias com competencia delegada ou federal previdenciaria
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LISTA_SUBSECOES_TRF1.map((sub) => (
              <div
                key={sub.uf}
                className="p-4 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm hover:border-amber-500 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 font-black text-[10px] uppercase border border-blue-200">
                    Justica Federal — Secao {sub.uf}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-2">{sub.nome}</h4>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Justica Federal & JEF</span>
                  <a
                    href="https://pje1g.trf1.jus.br/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-black text-amber-700 hover:underline flex items-center gap-1"
                  >
                    Acessar PJe Federal <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: CLIENTES / BENEFICIARIOS ──────────────────────────────────────── */}
      {activeSubTab === 'beneficiarios' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Carteira de Clientes Previdenciarios & Beneficiarios
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Controle de NBs, NIT/PIS e categorias de segurados cadastrados no escritorio
              </p>
            </div>

            <button
              onClick={() => setModalState(prev => ({ ...prev, novoCliente: true }))}
              className="px-4 py-2.5 rounded-xl btn-gold-3d text-xs font-black flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              + Cadastrar Novo Segurado
            </button>
          </div>

          <div className="space-y-3">
            {clientes.length === 0 ? (
              <div className="text-center py-12 glass-panel bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-900">Nenhum cliente cadastrado ainda</p>
                <p className="text-xs text-slate-500">Cadastre um cliente segurado para acompanhar o NB e acoes previdenciarias.</p>
              </div>
            ) : (
              clientes.map(cli => (
                <div key={cli.id} className="p-4 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 uppercase">
                        {cli.categoriaSegurado || 'Segurado INSS / Beneficiario'}
                      </span>
                      <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {cli.tipo}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 mt-1">{cli.nome}</h4>
                    <p className="text-xs text-slate-600 font-medium">CPF/CNPJ: <strong className="text-slate-900 font-mono">{cli.documento}</strong></p>

                    {cli.numeroBeneficioINSS && (
                      <p className="text-xs font-bold text-amber-800 font-mono mt-1">
                        NB INSS: {cli.numeroBeneficioINSS}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setModalState(prev => ({ ...prev, procuracao: true, clienteParaProcuracao: cli }))}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs border border-slate-300"
                    >
                      Emissao Procuracao INSS / Federal
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
