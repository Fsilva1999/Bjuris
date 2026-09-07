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
  BookOpen,
  Sparkles,
  ShieldCheck
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
      
      {/* 🌟 3D GOLD QUICK ACCESS BAR */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* Action 1: Previdenciário */}
          <button
            onClick={() => setActiveTab('previdenciario')}
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 border border-amber-500/60 hover:border-amber-400 text-white flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 rounded-2xl bg-amber-500/30 text-amber-300 border border-amber-500/50 mb-2 group-hover:scale-110 transition-transform shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-amber-300 group-hover:text-amber-200 transition-colors">Previdenciário</span>
            <span className="text-[10px] text-amber-400 font-extrabold mt-0.5">Calculadora INSS</span>
          </button>

          {/* Action 2: Novo Processo CNJ */}
          <button
            onClick={() => setModalState(prev => ({ ...prev, novoProcesso: true }))}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-amber-500/40 hover:border-amber-400 text-white flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 rounded-2xl bg-amber-500/20 text-[#d4af37] border border-amber-500/40 mb-2 group-hover:scale-110 transition-transform shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-slate-100 group-hover:text-amber-400 transition-colors">Novo Processo</span>
            <span className="text-[10px] text-amber-500/80 font-semibold mt-0.5">Cadastrar CNJ</span>
          </button>

          {/* Action 3: Novo Cliente */}
          <button
            onClick={() => setModalState(prev => ({ ...prev, novoCliente: true }))}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-amber-500/40 hover:border-amber-400 text-white flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-2 group-hover:scale-110 transition-transform shadow-md">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-slate-100 group-hover:text-emerald-400 transition-colors">Novo Segurado</span>
            <span className="text-[10px] text-emerald-400/80 font-semibold mt-0.5">Cliente & NB INSS</span>
          </button>

          {/* Action 4: Agendar Prazo */}
          <button
            onClick={() => setModalState(prev => ({ ...prev, novoPrazo: true }))}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-amber-500/40 hover:border-amber-400 text-white flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 rounded-2xl bg-amber-500/20 text-[#d4af37] border border-amber-500/40 mb-2 group-hover:scale-110 transition-transform shadow-md">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-slate-100 group-hover:text-amber-400 transition-colors">Agendar Prazo</span>
            <span className="text-[10px] text-amber-500/80 font-semibold mt-0.5">Prazo & Perícia</span>
          </button>

          {/* Action 5: Calculadora CPC */}
          <button
            onClick={() => setActiveTab('calculadora')}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-amber-500/40 hover:border-amber-400 text-white flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 mb-2 group-hover:scale-110 transition-transform shadow-md">
              <Calculator className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-slate-100 group-hover:text-purple-400 transition-colors">Calculadora CPC</span>
            <span className="text-[10px] text-purple-400/80 font-semibold mt-0.5">Contagem Úteis</span>
          </button>

          {/* Action 6: Procuração Ad Judicia */}
          <button
            onClick={() => setModalState(prev => ({ ...prev, procuracao: true }))}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-amber-500/40 hover:border-amber-400 text-white flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 rounded-2xl bg-amber-500/20 text-[#d4af37] border border-amber-500/40 mb-2 group-hover:scale-110 transition-transform shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-slate-100 group-hover:text-amber-400 transition-colors">Procuração</span>
            <span className="text-[10px] text-amber-500/80 font-semibold mt-0.5">INSS / Federal</span>
          </button>

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
              <span className="text-[11px] font-black text-red-700 uppercase tracking-widest block">Próximo Prazo em Atenção (CPC/2015)</span>
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

      {/* 4 Stat Cards - High Contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div
          onClick={() => setActiveTab('processos')}
          className="p-5 rounded-2xl glass-card bg-white border border-slate-200 cursor-pointer hover:border-amber-500 shadow-sm transition-all hover:scale-[1.01]"
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
          className="p-5 rounded-2xl glass-card bg-white border border-slate-200 cursor-pointer hover:border-amber-500 shadow-sm transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prazos em Atenção</span>
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
          className="p-5 rounded-2xl glass-card bg-white border border-slate-200 cursor-pointer hover:border-amber-500 shadow-sm transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Carteira Clientes</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-slate-900 mt-3">{clientes.length}</p>
          <p className="text-xs text-slate-600 font-medium mt-1">
            PF & PJ Cadastrados
          </p>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => setActiveTab('financeiro')}
          className="p-5 rounded-2xl glass-card bg-white border border-slate-200 cursor-pointer hover:border-amber-500 shadow-sm transition-all hover:scale-[1.01]"
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

      {/* Main Section: Agenda & Intimações */}
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

        {/* Right Column (1 col): Intimações */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900">Últimas Intimações</h3>

          {/* Timeline of Movimentações */}
          <div className="glass-panel bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Últimas Intimações DJe / PJe</h4>
            <div className="space-y-3">
              {processos.length === 0 || !(processos[0]?.movimentacoes) ? (
                <p className="text-xs text-slate-500 font-medium">Nenhuma intimação recente. Cadastre um processo para acompanhar.</p>
              ) : (
                processos[0].movimentacoes.map(m => (
                  <div key={m.id} className="text-xs border-l-2 border-amber-500 pl-3 py-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{m.titulo}</span>
                      <span className="text-[10px] text-amber-800 font-mono font-bold">{m.data}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">{m.descricao}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
