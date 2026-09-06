import React, { useState } from 'react';
import { useLegal } from '../../context/LegalContext';
import { TipoPrazo, PrioridadePrazo } from '../../types/legal';
import { X, Clock, AlertTriangle, Video, MapPin } from 'lucide-react';

export const NewPrazoModal: React.FC = () => {
  const { modalState, setModalState, processos, addPrazo, perfil } = useLegal();

  const [processoId, setProcessoId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<TipoPrazo>('prazo_fatal');
  const [dataHora, setDataHora] = useState('');
  const [prioridade, setPrioridade] = useState<PrioridadePrazo>('urgente');
  const [linkOnline, setLinkOnline] = useState('');
  const [local, setLocal] = useState('');
  const [observacao, setObservacao] = useState('');

  if (!modalState.novoPrazo) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proc = processos.find(p => p.id === processoId);
    if (!proc || !titulo || !dataHora) {
      alert('Preencha o processo, título e data/hora do prazo.');
      return;
    }

    addPrazo({
      processoId: proc.id,
      processoNumero: proc.numeroCnj,
      clienteNome: proc.clienteNome,
      titulo,
      tipo,
      dataHora: new Date(dataHora).toISOString(),
      prioridade,
      responsavel: perfil.nome,
      linkOnline: tipo === 'audiencia_online' ? linkOnline : undefined,
      local: tipo === 'audiencia_presencial' || tipo === 'reuniao' ? local : undefined,
      observacao
    });

    setModalState(prev => ({ ...prev, novoPrazo: false }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-300 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto text-slate-900">
        
        <button
          onClick={() => setModalState(prev => ({ ...prev, novoPrazo: false }))}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="p-3 rounded-xl bg-[#fef9c3] text-[#b8860b] border border-[#d4af37]/40 shadow-sm">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black font-outfit text-slate-900">Agendar Prazo ou Audiência</h3>
            <p className="text-xs text-slate-600 font-bold">Configure lembretes com Notificação Push automática</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">Processo Vinculado</label>
            <select
              value={processoId}
              onChange={e => setProcessoId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
            >
              <option value="" className="text-slate-900 font-bold">Selecione um processo...</option>
              {processos.map(p => (
                <option key={p.id} value={p.id} className="text-slate-900 font-bold">{p.numeroCnj} - {p.clienteNome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">Título do Prazo / Compromisso</label>
            <input
              type="text"
              required
              placeholder="Ex: Réplica à Contestação / Audiência de Instrução"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:border-[#d4af37] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">Tipo de Evento</label>
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value as TipoPrazo)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
              >
                <option value="prazo_fatal" className="text-slate-900 font-bold">Prazo Fatal (CPC/2015)</option>
                <option value="audiencia_online" className="text-slate-900 font-bold">Audiência Telepresencial (Zoom/Teams)</option>
                <option value="audiencia_presencial" className="text-slate-900 font-bold">Audiência Presencial no Fórum</option>
                <option value="reuniao" className="text-slate-900 font-bold">Reunião com Cliente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">Prioridade do Alerta</label>
              <select
                value={prioridade}
                onChange={e => setPrioridade(e.target.value as PrioridadePrazo)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
              >
                <option value="urgente" className="text-slate-900 font-bold">⚠️ Urgente (Notificação com Som)</option>
                <option value="alta" className="text-slate-900 font-bold">🔴 Alta</option>
                <option value="normal" className="text-slate-900 font-bold">🔵 Normal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">Data e Hora Limite</label>
            <input
              type="datetime-local"
              required
              value={dataHora}
              onChange={e => setDataHora(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
            />
          </div>

          {tipo === 'audiencia_online' && (
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 flex items-center gap-1 uppercase tracking-wide">
                <Video className="w-4 h-4 text-blue-600" /> Link da Audiência (Teams / Zoom / Google Meet)
              </label>
              <input
                type="url"
                placeholder="https://zoom.us/j/123456789"
                value={linkOnline}
                onChange={e => setLinkOnline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
              />
            </div>
          )}

          {(tipo === 'audiencia_presencial' || tipo === 'reuniao') && (
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 flex items-center gap-1 uppercase tracking-wide">
                <MapPin className="w-4 h-4 text-red-600" /> Local / Sala de Reunião
              </label>
              <input
                type="text"
                placeholder="Ex: Sala de Audiências nº 3 - Fórum Central Cível"
                value={local}
                onChange={e => setLocal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">Observações Estratégicas</label>
            <textarea
              rows={2}
              placeholder="Instruções para peticionamento, documentos exigidos ou rol de testemunhas..."
              value={observacao}
              onChange={e => setObservacao(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalState(prev => ({ ...prev, novoPrazo: false }))}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-colors border border-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl btn-gold-3d text-xs font-black transition-all shadow-md"
            >
              Agendar & Notificar
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
