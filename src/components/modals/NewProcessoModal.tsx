import React, { useState } from 'react';
import { useLegal } from '../../context/LegalContext';
import { AreaProcesso, TipoParte } from '../../types/legal';
import { LISTA_VARAS_MARANHAO } from '../../services/mockData';
import { X, Briefcase, Plus } from 'lucide-react';

export const NewProcessoModal: React.FC = () => {
  const { modalState, setModalState, clientes, addProcesso, perfil } = useLegal();

  const [numeroCnj, setNumeroCnj] = useState('');
  const [tribunal, setTribunal] = useState('TRF1');
  const [vara, setVara] = useState('1ª Vara Federal da Seção Judiciária (TRF1 / JEF)');
  const [varaCustom, setVaraCustom] = useState('');
  const [classe, setClasse] = useState('Procedimento do Juizado Especial Cível / Previdenciário');
  const [area, setArea] = useState<AreaProcesso>('Previdenciário');
  const [papelCliente, setPapelCliente] = useState<TipoParte>('Autor');
  const [clienteId, setClienteId] = useState('');
  const [parteContraria, setParteContraria] = useState('INSS - Instituto Nacional do Seguro Social');
  const [valorCausa, setValorCausa] = useState('65000');

  if (!modalState.novoProcesso) return null;

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
      advogadoResponsavel: perfil.nome
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
                <option value="TRF1" className="text-slate-900 font-black">TRF1 — Justiça Federal & JEF</option>
                <option value="TJMA" className="text-slate-900 font-bold">TJMA (Estadual)</option>
                <option value="TRT16" className="text-slate-900 font-bold">TRT16 (Trabalhista)</option>
                <option value="TJSP" className="text-slate-900 font-bold">TJSP (São Paulo)</option>
                <option value="TJRJ" className="text-slate-900 font-bold">TJRJ (Rio de Janeiro)</option>
                <option value="STJ" className="text-slate-900 font-bold">STJ / STF</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                Área Jurídica
              </label>
              <select
                value={area}
                onChange={e => setArea(e.target.value as AreaProcesso)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
              >
                <option value="Previdenciário" className="text-slate-900 font-black">🛡️ Previdenciário (INSS / BPC / RPV)</option>
                <option value="Cível" className="text-slate-900 font-bold">⚖️ Cível</option>
                <option value="Trabalhista" className="text-slate-900 font-bold">🔨 Trabalhista</option>
                <option value="Família e Sucessões" className="text-slate-900 font-bold">Família e Sucessões</option>
                <option value="Penal" className="text-slate-900 font-bold">Penal</option>
                <option value="Tributário" className="text-slate-900 font-bold">Tributário</option>
                <option value="Empresarial" className="text-slate-900 font-bold">Empresarial</option>
              </select>
            </div>
          </div>

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
                <option key={v} value={v} className="text-slate-900 font-bold">{v}</option>
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
                <option value="" className="text-slate-900 font-bold">Selecione o cliente...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id} className="text-slate-900 font-bold">{c.nome} ({c.tipo})</option>
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
                <option value="Autor" className="text-slate-900 font-bold">Autor / Requerente</option>
                <option value="Réu" className="text-slate-900 font-bold">Réu / Requerido</option>
                <option value="Terceiro Interessado" className="text-slate-900 font-bold">Terceiro Interessado</option>
              </select>
            </div>
          </div>

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
