import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext';
import {
  ShieldCheck,
  Calculator,
  Scale,
  Search,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Users,
  Building,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Briefcase
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

export const PrevidenciarioTRF1: React.FC = () => {
  const { clientes, processos, setModalState } = useLegal();

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'calculadora' | 'subsecoes' | 'beneficiarios'>('calculadora');

  // Calculator State
  const [tipoBeneficio, setTipoBeneficio] = useState<string>('bpc_loas');
  const [idadeCliente, setIdadeCliente] = useState<number>(65);
  const [genero, setGenero] = useState<'M' | 'F'>('F');
  const [rendaFamiliarTotal, setRendaFamiliarTotal] = useState<number>(1412);
  const [qtdPessoasFamilia, setQtdPessoasFamilia] = useState<number>(4);
  const [mesesAtrasados, setMesesAtrasados] = useState<number>(14);
  const [valorBeneficioEstimado, setValorBeneficioEstimado] = useState<number>(1412); // 1 Salário Mínimo R$ 1.412,00

  // Calculation Results
  const salMinimo2026 = 1518; // Valor de referência
  const limiteRpvSm = salMinimo2026 * 60; // R$ 91.080,00

  const rendaPerCapita = rendaFamiliarTotal / (qtdPessoasFamilia || 1);
  const atendeCriterioRendaBpc = rendaPerCapita <= (salMinimo2026 / 4);

  const valorBrutoAtrasados = mesesAtrasados * valorBeneficioEstimado;
  const isRpv = valorBrutoAtrasados <= limiteRpvSm;

  const processosPrevidenciarios = processos.filter(p => p.area === 'Previdenciário' || p.tribunal === 'TRF1');

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      
      {/* Header Banner Focus: Direito Previdenciário & TRF1 */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-[#d4af37] font-black text-xs border border-amber-500/40 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Módulo Especializado Previdenciário & TRF1
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-500/40 uppercase">
                Cível & Trabalhista
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-slate-100 tracking-wide">
              Gestão Previdenciária & Jurisdição TRF1
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Sistema otimizado para <strong className="text-amber-400 font-bold">Ações de BPC/LOAS</strong>, Concessões de Aposentadoria (Urbana e Rural / Segurado Especial), Benefícios por Incapacidade INSS e Requisições de Pagamento (<strong className="text-amber-300">RPV & Precatórios Federais no TRF1</strong>).
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => setModalState(prev => ({ ...prev, novoProcesso: true }))}
              className="w-full sm:w-auto px-5 py-3 rounded-xl btn-gold-3d text-xs font-black transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              Novo Processo TRF1 / INSS
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
          🧮 Calculadora de Benefícios & RPV TRF1
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
          🏛️ Seções Judiciárias do TRF1
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
          👥 Clientes & NBs Cadastrados ({clientes.length})
        </button>
      </div>

      {/* ─── SUB TAB 1: CALCULADORA PREVIDENCIÁRIA & LIQUIDAÇÃO RPV TRF1 ──────────────── */}
      {activeSubTab === 'calculadora' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Form Parameters */}
          <div className="lg:col-span-2 space-y-5">
            <div className="p-6 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-600" />
                  Simulador de Requisitos & RMI (Regras INSS / EC 103)
                </h3>
                <span className="text-xs text-amber-800 font-bold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  Ano de Referência: 2026
                </span>
              </div>

              {/* Select Benefit Type */}
              <div>
                <label className="block text-xs font-black text-slate-900 mb-2 uppercase tracking-wide">
                  Espécie de Benefício INSS / Ação Judicial
                </label>
                <select
                  value={tipoBeneficio}
                  onChange={e => setTipoBeneficio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                >
                  <option value="bpc_loas">BPC / LOAS (Benefício de Prestação Continuada — Lei 8.742/93)</option>
                  <option value="aposentadoria_idade_urbana">Aposentadoria por Idade Urbana (EC 103/2019)</option>
                  <option value="aposentadoria_rural">Aposentadoria Rural / Segurado Especial (Trabalhador Rural/Pescador)</option>
                  <option value="auxilio_doenca">Auxílio-Incapacidade Temporária (Antigo Auxílio-Doença)</option>
                  <option value="aposentadoria_invalidez">Aposentadoria por Incapacidade Permanente (Invalidez)</option>
                  <option value="pensao_morte">Pensão por Morte (Urbana e Rural)</option>
                </select>
              </div>

              {/* Dynamic Inputs based on Benefit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                    Gênero do Cliente
                  </label>
                  <select
                    value={genero}
                    onChange={e => setGenero(e.target.value as 'M' | 'F')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  >
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                    Idade Atual (Anos)
                  </label>
                  <input
                    type="number"
                    value={idadeCliente}
                    onChange={e => setIdadeCliente(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Additional BPC Specific Inputs */}
              {tipoBeneficio === 'bpc_loas' && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                  <span className="text-xs font-black text-amber-900 uppercase tracking-wider block">
                    Cálculo do Critério Miserabilidade / Renda Per Capita BPC
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Renda Familiar Bruta Total (R$)</label>
                      <input
                        type="number"
                        value={rendaFamiliarTotal}
                        onChange={e => setRendaFamiliarTotal(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nº de Integrantes do Grupo Familiar</label>
                      <input
                        type="number"
                        min="1"
                        value={qtdPessoasFamilia}
                        onChange={e => setQtdPessoasFamilia(parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Inputs for Liquidação Atrasados & RPV TRF1 */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-4 shadow-inner">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Estimativa de Retroativos (DER até Concessão JEF / TRF1)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Valor da Parcela Mensal (R$)</label>
                    <input
                      type="number"
                      value={valorBeneficioEstimado}
                      onChange={e => setValorBeneficioEstimado(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-black focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Meses de Atrasados (DER até Concessão)</label>
                    <input
                      type="number"
                      value={mesesAtrasados}
                      onChange={e => setMesesAtrasados(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-black focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right 1 Col: Results & RPV/Precatório Badge */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-2xl text-white space-y-4">
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Scale className="w-5 h-5 text-amber-400" />
                Resultado da Análise Previdenciária
              </h3>

              {/* Status Eligibility */}
              <div className="space-y-3">
                {tipoBeneficio === 'bpc_loas' && (
                  <div className={`p-3.5 rounded-xl border ${
                    atendeCriterioRendaBpc ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  }`}>
                    <span className="text-[10px] font-black uppercase block">Renda Per Capita Familiar</span>
                    <strong className="text-lg font-black font-mono">R$ {rendaPerCapita.toFixed(2)} / pessoa</strong>
                    <p className="text-xs mt-1 font-medium">
                      {atendeCriterioRendaBpc
                        ? '✅ Atende ao critério objetivo de 1/4 do salário mínimo (R$ 379,50).'
                        : '⚠️ Excede 1/4 do SM. Requer comprovação de vulnerabilidade social / gastos médicos no JEF TRF1.'}
                    </p>
                  </div>
                )}

                {/* Estimated Gross Backpay */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Total de Atrasados Estimado</span>
                  <strong className="text-2xl font-black font-mono text-amber-400">
                    R$ {valorBrutoAtrasados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">Calculado sobre {mesesAtrasados} meses</p>
                </div>

                {/* RPV vs Precatório Badge */}
                <div className={`p-4 rounded-xl border text-center space-y-1 ${
                  isRpv
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                }`}>
                  <span className="text-[10px] font-black uppercase tracking-widest block">Forma de Pagamento Federal (TRF1)</span>
                  <h4 className="text-base font-black uppercase font-outfit">
                    {isRpv ? '⚡ RPV — Requisição de Pequeno Valor (TRF1)' : '📜 Precatório Federal (TRF1)'}
                  </h4>
                  <p className="text-xs font-medium">
                    {isRpv
                      ? 'Inferior a 60 salários mínimos. Pagamento rápido em agência bancária (Caixa/BB) após expedição.'
                      : 'Superior a 60 salários mínimos. Incluído no orçamento anual de precatórios federais.'}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ─── SUB TAB 2: SEÇÕES JUDICIÁRIAS DO TRF1 ──────────────────────────────────── */}
      {activeSubTab === 'subsecoes' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-panel bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Jurisdição do Tribunal Regional Federal da 1ª Região (TRF1)
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Seções e Subseções Judiciárias com competência delegada ou federal previdenciária
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
                    TRF1 — Seção {sub.uf}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-2">{sub.nome}</h4>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Justiça Federal & JEF</span>
                  <a
                    href="https://pje1g.trf1.jus.br/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-black text-amber-700 hover:underline flex items-center gap-1"
                  >
                    Acessar PJe TRF1 <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SUB TAB 3: CLIENTES BENEFICIÁRIOS DO INSS ──────────────────────────────── */}
      {activeSubTab === 'beneficiarios' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Carteira de Clientes Previdenciários & Beneficiários
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Controle de NBs, NIT/PIS e categorias de segurados cadastrados no escritório
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
                <p className="text-xs text-slate-500">Cadastre um cliente segurado para acompanhar o NB e ações previdenciárias.</p>
              </div>
            ) : (
              clientes.map(cli => (
                <div key={cli.id} className="p-4.5 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 uppercase">
                        {cli.categoriaSegurado || 'Segurado INSS / Beneficiário'}
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
                      📄 Emissão Procuração INSS / TRF1
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
