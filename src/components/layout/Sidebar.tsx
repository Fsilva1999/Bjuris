import React from 'react';
import { useLegal } from '../../context/LegalContext';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  DollarSign,
  CreditCard,
  Calculator,
  Settings,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, logoUrl, processos, prazos, canInstallPwa, installPwa } = useLegal();

  const prazosPendentes = prazos.filter(p => !p.concluido).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'processos', label: 'Processos CNJ', icon: Briefcase, badge: processos.length },
    { id: 'clientes', label: 'Clientes & Documentos', icon: Users },
    { id: 'agenda', label: 'Agenda & Prazos', icon: Calendar, badge: prazosPendentes > 0 ? prazosPendentes : undefined, badgeColor: 'bg-red-600 text-white font-bold' },
    { id: 'financeiro', label: 'Financeiro & Honorários', icon: DollarSign },
    { id: 'carnes', label: 'Carnês (BPC / LOAS)', icon: CreditCard },
    { id: 'calculadora', label: 'Calculadora CPC', icon: Calculator },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen p-4 flex-shrink-0 shadow-sm">
      
      {/* Brand Header with Brenda Sousa Gold 3D Logo */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-slate-100">
        <img
          src={logoUrl}
          alt="Brenda Sousa Advogada Logo"
          className="w-12 h-12 object-contain drop-shadow-md"
        />
        <div>
          <h2 className="text-xl font-black font-outfit tracking-wide text-slate-900">
            BJuris
          </h2>
          <p className="text-[11px] text-[#b8860b] font-extrabold">Gestão Advocatícia</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-black transition-all ${
                isActive
                  ? 'btn-gold-3d shadow-md border-l-4 border-slate-950'
                  : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 font-bold'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-[#b8860b]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-slate-950 text-white font-extrabold' : (item.badgeColor || 'bg-slate-200 text-slate-900')}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* PWA Badge Footer */}
      <div className="pt-4 border-t border-slate-100">
        {canInstallPwa ? (
          <button
            onClick={installPwa}
            className="w-full p-3 rounded-xl btn-gold-3d text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Smartphone className="w-4 h-4 text-slate-950" />
            Instalar App BJuris
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-[11px] text-slate-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>PWA & Notificações Ativas</span>
          </div>
        )}
      </div>

    </aside>
  );
};
