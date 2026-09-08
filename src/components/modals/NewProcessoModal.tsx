import React, { useState } from 'react';
import { useLegal } from '../../context/LegalContext';
import { AreaProcesso, TipoParte } from '../../types/legal';
import { LISTA_VARAS_MARANHAO } from '../../services/mockData';
import { X, Briefcase, Plus, ChevronDown } from 'lucide-react';

// ─── Dados hierárquicos das áreas previdenciárias ────────────────────────────
const TEMAS_PREVIDENCIARIOS: { categoria: string; itens: string[] }[] = [
  {
    categoria: 'Aposentadorias',
    itens: [
      'Aposentadoria por idade urbana',
      'Aposentadoria por idade rural',
      'Aposentadoria por tempo de contribuição — regras de transição',
      'Aposentadoria especial',
      'Aposentadoria por incapacidade permanente',
      'Aposentadoria da pessoa com deficiência',
      'Aposentadoria do professor',
      'Aposentadoria híbrida',
      'Aposentadoria do trabalhador rural',
      'Aposentadorias pelas regras anteriores à Reforma da Previdência',
      'Planejamento previdenciário',
    ],
  },
  {
    categoria: 'Benefícios por incapacidade',
    itens: [
      'Auxílio por incapacidade temporária (antigo auxílio-doença)',
      'Aposentadoria por incapacidade permanente',
      'Auxílio-acidente',
      'Benefícios decorrentes de acidente de trabalho',
      'Reabilitação profissional',
      'Discussão de incapacidade e perícia médica',
    ],
  },
  {
    categoria: 'Benefícios para dependentes',
    itens: [
      'Pensão por morte',
      'Pensão por morte rural',
      'Auxílio-reclusão',
      'Revisão de pensão',
      'Concessão e manutenção de benefícios de dependentes',
    ],
  },
  {
    categoria: 'Previdência rural',
    itens: [
      'Aposentadoria rural',
      'Aposentadoria híbrida',
      'Auxílio por incapacidade do segurado rural',
      'Salário-maternidade rural',
      'Pensão por morte rural',
      'Comprovação de atividade rural',
      'Segurado especial',
      'Economia familiar',
      'Tempo rural antigo',
    ],
  },
  {
    categoria: 'Salário-maternidade',
    itens: [
      'Salário-maternidade urbano',
      'Salário-maternidade rural',
      'Salário-maternidade da segurada facultativa',
      'Salário-maternidade da contribuinte individual',
      'Salário-maternidade em situações de adoção',
      'Discussões sobre carência e qualidade de segurada',
    ],
  },
  {
    categoria: 'Pessoa com deficiência',
    itens: [
      'Aposentadoria da pessoa com deficiência por idade',
      'Aposentadoria da pessoa com deficiência por tempo de contribuição',
      'Avaliação do grau de deficiência',
      'Benefícios por incapacidade',
      'BPC/LOAS para pessoa com deficiência',
    ],
  },
  {
    categoria: 'BPC/LOAS',
    itens: [
      'BPC para pessoa com deficiência',
      'BPC para pessoa idosa',
      'Avaliação socioeconômica',
      'Renda familiar',
      'Cadastro Único',
      'Negativa ou suspensão do benefício',
      'Restabelecimento',
      'Revisão',
      'Judicialização',
    ],
  },
  {
    categoria: 'Revisões de benefícios',
    itens: [
      'Revisão de aposentadoria',
      'Revisão de pensão',
      'Revisão de benefício por incapacidade',
      'Revisão de cálculo',
      'Revisão de salários de contribuição',
      'Inclusão de períodos não considerados',
      'Inclusão de tempo rural',
      'Inclusão de tempo especial',
      'Erros no cálculo do INSS',
      'Revisões decorrentes de decisões judiciais',
    ],
  },
  {
    categoria: 'Tempo de contribuição',
    itens: [
      'Contagem de tempo',
      'Averbação de tempo',
      'Tempo rural',
      'Tempo especial',
      'Conversão de tempo especial',
      'Tempo de serviço público',
      'Tempo militar',
      'Contribuições em atraso',
      'Acerto de vínculos',
      'CTC',
      'Períodos não registrados no CNIS',
    ],
  },
  {
    categoria: 'Atividade especial',
    itens: [
      'Insalubridade',
      'Periculosidade',
      'Exposição a agentes químicos',
      'Agentes físicos',
      'Agentes biológicos',
      'PPP',
      'LTCAT',
      'Enquadramento de atividade especial',
      'Conversão de tempo especial',
      'Discussões sobre EPI',
    ],
  },
  {
    categoria: 'Contribuições ao INSS',
    itens: [
      'Segurado empregado',
      'Contribuinte individual',
      'Facultativo',
      'MEI',
      'Segurado especial',
      'Contribuição em atraso',
      'Cálculo de contribuições',
      'Planejamento de contribuições',
      'Restituição de contribuições',
      'Regularização do CNIS',
    ],
  },
  {
    categoria: 'CNIS e problemas cadastrais',
    itens: [
      'Vínculos ausentes',
      'Vínculos incorretos',
      'Salários de contribuição incorretos',
      'Indicadores do CNIS',
      'Acerto de dados',
      'Inclusão de contribuições',
      'Exclusão/correção de informações incorretas',
    ],
  },
  {
    categoria: 'Processos administrativos',
    itens: [
      'Pedido de benefício no Meu INSS',
      'Cumprimento de exigência',
      'Recurso administrativo',
      'Pedido de revisão',
      'Justificação administrativa',
      'Contestação de indeferimento',
      'Restabelecimento de benefício',
    ],
  },
  {
    categoria: 'Processos judiciais',
    itens: [
      'Ação de concessão de benefício',
      'Ação de restabelecimento',
      'Ação de revisão',
      'Mandado de segurança em situações cabíveis',
      'Ações relacionadas a perícia',
      'Cobrança de parcelas atrasadas',
      'Tutela de urgência',
      'Cumprimento de sentença',
      'Execução de atrasados',
    ],
  },
  {
    categoria: 'Valores atrasados',
    itens: [
      'Cálculo de atrasados',
      'Parcelas vencidas',
      'Correção monetária',
      'Juros',
      'RPV',
      'Precatório',
      'Cumprimento de sentença',
    ],
  },
  {
    categoria: 'Planejamento previdenciário',
    itens: [
      'Quando se aposentar',
      'Qual regra é mais vantajosa',
      'Quanto contribuir',
      'Quanto poderá receber',
      'Análise do CNIS',
      'Regras de transição',
      'Tempo especial',
      'Tempo rural',
      'Simulação de aposentadoria',
    ],
  },
  {
    categoria: 'Outros temas',
    itens: [
      'Qualidade de segurado',
      'Período de graça',
      'Carência',
      'Dependentes',
      'Acumulação de benefícios',
      'Descontos indevidos',
      'Empréstimos consignados',
      'Bloqueio/suspensão de benefício',
      'Prova de vida',
      'Pagamentos não recebidos',
    ],
  },
];

export const NewProcessoModal: React.FC = () => {
  const { modalState, setModalState, clientes, addProcesso, perfil } = useLegal();

  const [numeroCnj, setNumeroCnj] = useState('');
  const [tribunal, setTribunal] = useState('TRF');
  const [vara, setVara] = useState('1ª Vara Federal da Seção Judiciária (Justiça Federal / JEF)');
  const [varaCustom, setVaraCustom] = useState('');
  const [classe, setClasse] = useState('Procedimento do Juizado Especial Cível / Previdenciário');
  const [area, setArea] = useState<AreaProcesso>('Previdenciário');
  const [papelCliente, setPapelCliente] = useState<TipoParte>('Autor');
  const [clienteId, setClienteId] = useState('');
  const [parteContraria, setParteContraria] = useState('INSS - Instituto Nacional do Seguro Social');
  const [valorCausa, setValorCausa] = useState('65000');

  // Previdenciário theme selection
  const [categoriaPrevidenciaria, setCategoriaPrevidenciaria] = useState('');
  const [temaPrevidenciario, setTemaPrevidenciario] = useState('');

  if (!modalState.novoProcesso) return null;

  const itensDaCategoria = TEMAS_PREVIDENCIARIOS.find(t => t.categoria === categoriaPrevidenciaria)?.itens ?? [];

  const handleAreaChange = (novaArea: string) => {
    setArea(novaArea as AreaProcesso);
    if (novaArea !== 'Previdenciário') {
      setCategoriaPrevidenciaria('');
      setTemaPrevidenciario('');
    }
  };

  const handleCategoriaChange = (cat: string) => {
    setCategoriaPrevidenciaria(cat);
    setTemaPrevidenciario('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) {
      alert('Por favor, selecione um cliente cadastrado.');
      return;
    }

    const varaFinal = varaCustom || vara;

    addProcesso({
      numeroCnj: numeroCnj || `080${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 89)}.2024.8.10.0001`,
      tribunal,
      vara: varaFinal,
      classe,
      area,
      papelCliente,
      status: 'em_andamento',
      clienteId: cliente.id,
      clienteNome: cliente.nome,
      parteContraria: parteContraria || 'Réu Não Especificado',
      valorCausa: parseFloat(valorCausa) || 0,
      dataDistribuicao: new Date().toISOString().split('T')[0],
      advogadoResponsavel: perfil.nome,
      ...(area === 'Previdenciário' && {
        categoriaPrevidenciaria: categoriaPrevidenciaria || undefined,
        temaPrevidenciario: temaPrevidenciario || undefined,
      }),
    });

    setModalState(prev => ({ ...prev, novoProcesso: false }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-300 shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto text-slate-900">

        <button
          onClick={() => setModalState(prev => ({ ...prev, novoProcesso: false }))}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="p-3 rounded-xl bg-[#fef9c3] text-[#b8860b] border border-[#d4af37]/40 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black font-outfit text-slate-900">Cadastrar Novo Processo CNJ</h3>
            <p className="text-xs text-slate-600 font-bold">Selecione o Tribunal e Vara ou Estado do processo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Número CNJ */}
          <div>
            <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
              Número do Processo (Padrão CNJ)
            </label>
            <input
              type="text"
              placeholder="Ex: 0804812-39.2024.8.10.0001"
              value={numeroCnj}
              onChange={e => setNumeroCnj(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:border-[#d4af37] focus:bg-white focus:ring-2 focus:ring-[#d4af37]/30 focus:outline-none"
            />
          </div>

          {/* Tribunal + Área */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                Tribunal / Estado
              </label>
              <select
                value={tribunal}
                onChange={e => setTribunal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
              >
                <option value="TRF">Justiça Federal & JEF</option>
                <option value="TJMA">TJMA (Estadual)</option>
                <option value="TRT16">TRT16 (Trabalhista)</option>
                <option value="TJSP">TJSP (São Paulo)</option>
                <option value="TJRJ">TJRJ (Rio de Janeiro)</option>
                <option value="STJ">STJ / STF</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                Área Jurídica
              </label>
              <select
                value={area}
                onChange={e => handleAreaChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
              >
                <option value="Previdenciário">Previdenciário</option>
                <option value="Cível">Cível</option>
                <option value="Trabalhista">Trabalhista</option>
                <option value="Família e Sucessões">Família e Sucessões</option>
                <option value="Penal">Penal</option>
                <option value="Tributário">Tributário</option>
                <option value="Empresarial">Empresarial</option>
              </select>
            </div>
          </div>

          {/* ─── BLOCO PREVIDENCIÁRIO: seleção de categoria + tema ─────────────── */}
          {area === 'Previdenciário' && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
              <p className="text-[11px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-amber-400 text-slate-950 flex items-center justify-center text-[9px] font-black flex-shrink-0">P</span>
                Tema Previdenciário
              </p>

              {/* Nível 1: Categoria */}
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">
                  Categoria
                </label>
                <select
                  value={categoriaPrevidenciaria}
                  onChange={e => handleCategoriaChange(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                >
                  <option value="">Selecione a categoria...</option>
                  {TEMAS_PREVIDENCIARIOS.map(t => (
                    <option key={t.categoria} value={t.categoria}>
                      {t.categoria}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nível 2: Tema específico — aparece quando categoria está selecionada */}
              {categoriaPrevidenciaria && (
                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase tracking-wide">
                    Tema específico
                  </label>
                  <select
                    value={temaPrevidenciario}
                    onChange={e => setTemaPrevidenciario(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                  >
                    <option value="">Selecione o tema...</option>
                    {itensDaCategoria.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tag de confirmação quando ambos selecionados */}
              {categoriaPrevidenciaria && temaPrevidenciario && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-100 border border-amber-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p className="text-[11px] font-bold text-amber-900 leading-snug">
                    <span className="text-amber-600">{categoriaPrevidenciaria}</span>
                    {' — '}
                    {temaPrevidenciario}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Vara */}
          <div>
            <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
              Selecione a Vara ou Juízo
            </label>
            <select
              value={vara}
              onChange={e => setVara(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none mb-2"
            >
              {LISTA_VARAS_MARANHAO.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Ou digite o nome de outra vara personalizada..."
              value={varaCustom}
              onChange={e => setVaraCustom(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:border-[#d4af37] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Cliente + Posição */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                Cliente Vinculado
              </label>
              <select
                value={clienteId}
                onChange={e => setClienteId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
              >
                <option value="">Selecione o cliente...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome} ({c.tipo})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                Posição do Cliente
              </label>
              <select
                value={papelCliente}
                onChange={e => setPapelCliente(e.target.value as TipoParte)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
              >
                <option value="Autor">Autor / Requerente</option>
                <option value="Réu">Réu / Requerido</option>
                <option value="Terceiro Interessado">Terceiro Interessado</option>
              </select>
            </div>
          </div>

          {/* Parte Contrária + Valor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                Parte Contrária
              </label>
              <input
                type="text"
                placeholder="Ex: Empresa X / Banco Y"
                value={parteContraria}
                onChange={e => setParteContraria(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:border-[#d4af37] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                Valor da Causa (R$)
              </label>
              <input
                type="number"
                value={valorCausa}
                onChange={e => setValorCausa(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalState(prev => ({ ...prev, novoProcesso: false }))}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-colors border border-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl btn-gold-3d text-xs font-black transition-all shadow-md"
            >
              Salvar Processo
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
