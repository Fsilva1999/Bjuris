import React from 'react';
import { useLegal } from '../../context/LegalContext';
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  DollarSign,
  Menu
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, prazos } = useLegal();

  const prazosPendentes = prazos.filter(p => !p.concluido).length;

  const tabs = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'processos', label: 'Processos', icon: Briefcase },
    { id: 'agenda', label: 'Agenda', icon: Calendar, badge: prazosPendentes > 0 ? prazosPendentes : undefined },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'configuracoes', label: 'Mais', icon: Menu },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/80 px-2 py-1.5 backdrop-blur-xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive ? 'text-gold-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-gold-400 scale-110' : 'text-slate-400'} transition-transform`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] flex items-center justify-center px-1">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-gold-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
