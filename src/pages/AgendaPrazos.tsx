import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext';
import { TipoPrazo, PrioridadePrazo } from '../types/legal';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Video,
  MapPin,
  Volume2
} from 'lucide-react';
import { triggerDeadlineAlert } from '../utils/pwaNotifications';

export const AgendaPrazos: React.FC = () => {
  const { prazos, togglePrazoConcluido, setModalState, dispararNotificacaoPrazo } = useLegal();

  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [filterConcluido, setFilterConcluido] = useState<boolean>(false);

  const filteredPrazos = prazos.filter(p => {
    const matchesTipo = filterTipo === 'todos' || p.tipo === filterTipo;
    const matchesConcluido = filterConcluido ? p.concluido : !p.concluido;
    return matchesTipo && matchesConcluido;
  });

  const getTipoBadge = (tipo: TipoPrazo) => {
    switch (tipo) {
      case 'prazo_fatal':
        return <span className="px-3 py-1 rounded bg-red-100 text-red-900 font-black text-xs border border-red-300 uppercase">Prazo em Atenção</span>;
      case 'audiencia_online':
        return <span className="px-3 py-1 rounded bg-blue-100 text-blue-900 font-black text-xs border border-blue-300 uppercase">Audiência Telepresencial</span>;
      case 'audiencia_presencial':
        return <span className="px-3 py-1 rounded bg-purple-100 text-purple-900 font-black text-xs border border-purple-300 uppercase">Audiência Presencial</span>;
      default:
        return <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300 uppercase">Reunião</span>;
    }
  };

  const getPrioridadeBadge = (p: PrioridadePrazo) => {
    switch (p) {
      case 'urgente':
        return <span className="text-xs font-black text-red-700 flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-red-600" /> URGENTE</span>;
      case 'alta':
        return <span className="text-xs font-black text-amber-800">Prioridade Alta</span>;
      default:
        return <span className="text-xs text-slate-700 font-bold">Normal</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-outfit text-slate-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-[#b8860b]" />
            Agenda de Prazos em Atenção & Audiências
          </h2>
          <p className="text-xs text-slate-700 font-bold mt-1">
            Controle de intimações judiciais, prazos em dias úteis CPC/2015 e alertas com som
          </p>
        </div>

        <button
          onClick={() => setModalState(prev => ({ ...prev, novoPrazo: true }))}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-gold-3d text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          + Agendar Prazo / Audiência
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterTipo('todos')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              filterTipo === 'todos' ? 'btn-gold-3d shadow-sm' : 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            Todos ({prazos.length})
          </button>
          <button
            onClick={() => setFilterTipo('prazo_fatal')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              filterTipo === 'prazo_fatal' ? 'btn-gold-3d shadow-sm' : 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            Prazos em Atenção
          </button>
          <button
            onClick={() => setFilterTipo('audiencia_online')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              filterTipo === 'audiencia_online' ? 'btn-gold-3d shadow-sm' : 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            Audiências Telepresenciais
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterConcluido(!filterConcluido)}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
              filterConcluido
                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {filterConcluido ? 'Exibindo Concluídos' : 'Exibindo Pendentes'}
          </button>
        </div>
      </div>

      {/* Prazos List */}
      <div className="space-y-4">
        {filteredPrazos.length === 0 ? (
          <div className="text-center py-12 glass-panel bg-white rounded-2xl border border-slate-200 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-black text-slate-900">Nenhum compromisso pendente nesta visualização</p>
            <p className="text-xs text-slate-600 mt-1 font-bold">Todos os prazos foram cumpridos ou filtrados.</p>
          </div>
        ) : (
          filteredPrazos.map(p => {
            const dataObjeto = new Date(p.dataHora);
            return (
              <div
                key={p.id}
                className={`p-5 rounded-2xl glass-card bg-white border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-sm ${
                  p.concluido
                    ? 'border-slate-200 opacity-60 bg-slate-50'
                    : p.prioridade === 'urgente'
                    ? 'border-red-300 bg-red-50/40'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => togglePrazoConcluido(p.id)}
                    className={`mt-1 p-2 rounded-xl transition-all ${
                      p.concluido
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getTipoBadge(p.tipo)}
                      {getPrioridadeBadge(p.prioridade)}
                    </div>

                    <h3 className={`text-base font-extrabold ${p.concluido ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {p.titulo}
                    </h3>

                    {/* Highly Visible Black / Dark Text for Process Number & Client Name */}
                    <p className="text-xs text-slate-900 font-extrabold">
                      Proc: <strong className="text-[#8b6508] font-mono font-black">{p.processoNumero}</strong> • Cliente: <span className="text-slate-900 font-black">{p.clienteNome}</span>
                    </p>

                    {p.linkOnline && (
                      <a
                        href={p.linkOnline}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:underline pt-1 font-mono font-black"
                      >
                        <Video className="w-4 h-4 text-blue-600" /> Acessar Sala Telepresencial (Zoom/Teams)
                      </a>
                    )}

                    {p.local && (
                      <p className="text-xs text-slate-900 font-bold pt-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-red-600" /> {p.local}
                      </p>
                    )}

                    {p.observacao && (
                      <p className="text-xs text-slate-700 font-bold italic pt-1">
                        "{p.observacao}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Date & Alert Trigger */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-sm font-black font-mono text-[#8b6508] block">
                      {dataObjeto.toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-xs text-slate-900 font-mono font-black block">
                      {dataObjeto.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {!p.concluido && (
                    <button
                      onClick={() => dispararNotificacaoPrazo(p.id)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      Disparar Alerta Som
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
