import React, { useState } from 'react';
import { useLegal } from '../../context/LegalContext';
import {
  Search,
  Plus,
  Bell,
  Download,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  UserPlus,
  Clock,
  FileText
} from 'lucide-react';
import { sendNativeNotification } from '../../utils/pwaNotifications';

export const Navbar: React.FC = () => {
  const {
    perfil,
    logoUrl,
    canInstallPwa,
    installPwa,
    setModalState,
    prazos,
    setActiveTab
  } = useLegal();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const prazosUrgentes = prazos.filter(p => !p.concluido && p.prioridade === 'urgente');

  const handleTestNotification = () => {
    sendNativeNotification('⚖️ BJuris Notificações Ativas!', {
      body: 'Seu sistema está pronto para alertar sobre prazos fatais e audiências.',
      playSound: true
    });
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-4 py-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-4 max-w-[1700px] mx-auto">
        
        {/* Brand logo for mobile / tablet */}
        <div className="flex items-center gap-3 lg:hidden">
          <img
            src={logoUrl}
            alt="BJuris Logo"
            className="w-10 h-10 object-contain drop-shadow"
          />
          <div>
            <h1 className="text-lg font-black font-outfit tracking-wider text-slate-900">
              BJuris
            </h1>
            <p className="text-[11px] text-slate-600 font-bold">OAB/{perfil.oabUf} {perfil.oabNumero}</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden sm:flex items-center flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-[#d4af37] absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nº CNJ, cliente ou vara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 font-bold placeholder-slate-500 focus:outline-none focus:border-[#d4af37] focus:bg-white focus:ring-2 focus:ring-[#d4af37]/30 transition-all"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* PWA Install Button */}
          {canInstallPwa && (
            <button
              onClick={installPwa}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl btn-gold-3d text-xs font-black transition-all shadow-md animate-pulse"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xs:inline">Instalar App</span>
            </button>
          )}

          {/* Quick Create Menu */}
          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl btn-gold-3d text-xs font-black transition-all shadow"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Novo</span>
            </button>

            {showQuickMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    setModalState(prev => ({ ...prev, novoProcesso: true }));
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs text-slate-900 hover:bg-[#fef9c3] flex items-center gap-2.5 font-bold"
                >
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Novo Processo CNJ
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    setModalState(prev => ({ ...prev, novoCliente: true }));
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs text-slate-900 hover:bg-[#fef9c3] flex items-center gap-2.5 font-bold"
                >
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  Novo Cliente (Doc & Scan)
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    setModalState(prev => ({ ...prev, novoPrazo: true }));
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs text-slate-900 hover:bg-[#fef9c3] flex items-center gap-2.5 font-bold"
                >
                  <Clock className="w-4 h-4 text-[#d4af37]" />
                  Agendar Prazo / Audiência
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    setModalState(prev => ({ ...prev, procuracao: true }));
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs text-slate-900 hover:bg-[#fef9c3] flex items-center gap-2.5 font-bold border-t border-slate-100 mt-1 pt-2"
                >
                  <FileText className="w-4 h-4 text-[#b8860b]" />
                  Gerar Procuração
                </button>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all shadow-sm"
              title="Notificações e Alertas"
            >
              <Bell className="w-4 h-4 text-slate-800" />
              {prazosUrgentes.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {prazosUrgentes.length}
                </span>
              )}
            </button>

            {showNotificationsMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#d4af37]" />
                    Alertas & Prazos Fatais
                  </h4>
                  <button
                    onClick={handleTestNotification}
                    className="text-[11px] font-bold text-[#b8860b] hover:underline"
                  >
                    Testar Push
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {prazosUrgentes.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-600 font-medium">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                      Nenhum prazo urgente pendente no momento.
                    </div>
                  ) : (
                    prazosUrgentes.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setShowNotificationsMenu(false);
                          setActiveTab('agenda');
                        }}
                        className="p-2.5 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-red-900">{p.titulo}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-600 text-white font-bold uppercase">Urgente</span>
                        </div>
                        <p className="text-[11px] text-slate-700 font-medium mt-0.5">Proc: {p.processoNumero}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div
            onClick={() => setActiveTab('configuracoes')}
            className="flex items-center gap-2.5 pl-3 border-l border-slate-200 cursor-pointer hover:opacity-90 transition-all"
          >
            <img
              src={perfil.fotoUrl}
              alt={perfil.nome}
              className="w-9 h-9 rounded-xl object-cover border-2 border-[#d4af37] shadow-sm"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-black text-slate-900 leading-none">{perfil.nome}</p>
              <p className="text-[11px] text-[#b8860b] font-mono leading-none mt-1 font-black">OAB/{perfil.oabUf} {perfil.oabNumero}</p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
