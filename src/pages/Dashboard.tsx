import React from 'react';
import { useLegal } from '../context/LegalContext';
import {
  Scale,
  Briefcase,
  Users,
  Clock,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  Plus,
  FileText,
  Calculator,
  CheckCircle2,
  Calendar,
  ExternalLink,
  MapPin,
  BookOpen
} from 'lucide-react';
import { triggerDeadlineAlert } from '../utils/pwaNotifications';

export const Dashboard: React.FC = () => {
  const {
    perfil,
    processos,
    clientes,
    prazos,
    financeiro,
    setActiveTab,
    setModalState,
    togglePrazoConcluido
  } = useLegal();

  // Metrics
  const processosAtivos = processos.filter(p => p.status === 'em_andamento' || p.status === 'aguardando_audiencia');
  const prazosUrgentes = prazos.filter(p => !p.concluido && p.prioridade === 'urgente');
  const honorariosPendentes = financeiro
    .filter(f => f.status === 'pendente')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const honorariosRecebidosMes = financeiro
    .filter(f => f.status === 'pago')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const proximoPrazo = prazos.filter(p => !p.concluido)[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-6 border border-slate-800 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={perfil.fotoUrl}
              alt={perfil.nome}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-lg"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black font-outfit text-white tracking-wide">{perfil.nome}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black font-mono text-xs shadow">
                  OAB/{perfil.oabUf} {perfil.oabNumero}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-300 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {perfil.escritorio} • <strong className="text-amber-400">{processosAtivos.length} processos ativos</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setModalState(prev => ({ ...prev, novoProcesso: true }))}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Novo Processo CNJ
            </button>
            <button
              onClick={() => setModalState(prev => ({ ...prev, procuracao: true }))}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              Procuração
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Warning Notification Banner */}
      {proximoPrazo && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shadow">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-black text-red-700 uppercase tracking-widest block">Próximo Prazo Fatal CPC/2015</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{proximoPrazo.titulo}</h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Proc: <strong className="text-amber-800 font-mono">{proximoPrazo.processoNumero}</strong> • {proximoPrazo.clienteNome}</p>
            </div>
          </div>

          <button
            onClick={() => triggerDeadlineAlert(proximoPrazo.titulo, proximoPrazo.processoNumero)}
            className="px-4 py-2 rounded-xl bg-red-600 text-white font-black text-xs hover:bg-red-700 transition-all flex-shrink-0 shadow"
          >
            Disparar Alerta Som & Push
          </button>
        </div>
      )}

      {/* 4 Stat Cards - Pure White High Contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div
          onClick={() => setActiveTab('processos')}
          className="p-5 rounded-2xl glass-card bg-white border border-slate-200 cursor-pointer hover:border-amber-500 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Processos Ativos</span>
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 border border-blue-200">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-slate-900 mt-3">{processosAtivos.length}</p>
          <p className="text-xs text-slate-600 font-medium mt-1">
            <strong className="text-amber-700">{processos.length}</strong> cadastrados no sistema
          </p>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => setActiveTab('agenda')}
          className="p-5 rounded-2xl glass-card bg-white border border-slate-200 cursor-pointer hover:border-amber-500 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prazos Fatais</span>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-amber-800 mt-3">{prazosUrgentes.length}</p>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Urgentes para este mês
          </p>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => setActiveTab('clientes')}
          className="p-5 rounded-2xl glass-card bg-white border border-slate-200 cursor-pointer hover:border-amber-500 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Carteira Clientes</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-slate-900 mt-3">{clientes.length}</p>
          <p className="text-xs text-slate-600 font-medium mt-1">
            PF & PJ no Maranhão e Brasil
          </p>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => setActiveTab('financeiro')}
          className="p-5 rounded-2xl glass-card bg-white border border-slate-200 cursor-pointer hover:border-amber-500 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Honorários Mês</span>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black font-outfit text-amber-800 mt-3">
            R$ {honorariosRecebidosMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-600 font-medium mt-1">
            R$ {honorariosPendentes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} a receber
          </p>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Prazos & Audiências */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              Agenda de Prazos & Audiências
            </h3>
            <button
              onClick={() => setActiveTab('agenda')}
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              Ver Agenda Completa <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {prazos.slice(0, 4).map(p => (
              <div
                key={p.id}
                className={`p-4 rounded-2xl glass-card bg-white border flex items-center justify-between gap-4 shadow-sm ${
                  p.concluido
                    ? 'border-slate-200 opacity-60'
                    : p.prioridade === 'urgente'
                    ? 'border-red-300 bg-red-50/40'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => togglePrazoConcluido(p.id)}
                    className={`mt-0.5 p-1.5 rounded-xl transition-colors ${
                      p.concluido ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600 hover:text-amber-700'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-bold ${p.concluido ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {p.titulo}
                      </h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                        p.tipo === 'prazo_fatal' ? 'bg-red-100 text-red-800 border border-red-200' :
                        p.tipo === 'audiencia_online' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {p.tipo.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Proc: <strong className="text-amber-800 font-mono font-bold">{p.processoNumero}</strong> • {p.clienteNome}
                    </p>

                    {p.linkOnline && (
                      <a
                        href={p.linkOnline}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1 font-mono font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Entrar na Sala Telepresencial (Zoom/Teams)
                      </a>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black font-mono text-amber-800 block">
                    {new Date(p.dataHora).toLocaleDateString('pt-BR')}
                  </span>
                  <p className="text-[11px] text-slate-500 font-mono font-bold">
                    {new Date(p.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 col): Ações Rápidas & Intimações */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900">Acesso Rápido</h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setModalState(prev => ({ ...prev, novoCliente: true }))}
              className="p-3.5 rounded-2xl glass-card bg-white border border-slate-200 flex flex-col items-center justify-center text-center hover:border-amber-500 shadow-sm"
            >
              <Users className="w-6 h-6 text-emerald-600 mb-1" />
              <span className="text-xs font-bold text-slate-900">Novo Cliente</span>
            </button>

            <button
              onClick={() => setModalState(prev => ({ ...prev, novoPrazo: true }))}
              className="p-3.5 rounded-2xl glass-card bg-white border border-slate-200 flex flex-col items-center justify-center text-center hover:border-amber-500 shadow-sm"
            >
              <Clock className="w-6 h-6 text-amber-600 mb-1" />
              <span className="text-xs font-bold text-slate-900">Agendar Prazo</span>
            </button>

            <button
              onClick={() => setActiveTab('calculadora')}
              className="p-3.5 rounded-2xl glass-card bg-white border border-slate-200 flex flex-col items-center justify-center text-center hover:border-amber-500 shadow-sm"
            >
              <Calculator className="w-6 h-6 text-purple-600 mb-1" />
              <span className="text-xs font-bold text-slate-900">Calculadora CPC</span>
            </button>

            <button
              onClick={() => setModalState(prev => ({ ...prev, procuracao: true }))}
              className="p-3.5 rounded-2xl glass-card bg-white border border-slate-200 flex flex-col items-center justify-center text-center hover:border-amber-500 shadow-sm"
            >
              <FileText className="w-6 h-6 text-amber-600 mb-1" />
              <span className="text-xs font-bold text-slate-900">Procuração</span>
            </button>
          </div>

          {/* Timeline of Movimentações */}
          <div className="glass-panel bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Últimas Intimações DJe / PJe Maranhão</h4>
            <div className="space-y-3">
              {processos[0]?.movimentacoes.map(m => (
                <div key={m.id} className="text-xs border-l-2 border-amber-500 pl-3 py-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{m.titulo}</span>
                    <span className="text-[10px] text-amber-800 font-mono font-bold">{m.data}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{m.descricao}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
