import React, { useState } from 'react';
import { useLegal } from '../../context/LegalContext';
import { Smartphone, Download, X, ShieldCheck } from 'lucide-react';

export const InstallBanner: React.FC = () => {
  const { canInstallPwa, installPwa } = useLegal();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstallPwa || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-gold-600 via-gold-500 to-amber-500 text-slate-950 px-4 py-2.5 shadow-xl flex items-center justify-between text-xs font-medium z-40 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2.5 max-w-4xl mx-auto flex-1">
        <div className="p-1.5 rounded-lg bg-slate-950/20 text-slate-950">
          <Smartphone className="w-4 h-4 animate-bounce" />
        </div>
        <div className="flex-1">
          <span className="font-bold uppercase tracking-wider text-[11px]">Aplicativo PWA BJuris</span>
          <p className="text-[11px] text-slate-900 leading-tight hidden xs:block">
            Instale na sua tela inicial para acessar offline e receber notificações sonoras de prazos!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={installPwa}
          className="px-3 py-1 rounded-lg bg-slate-950 text-gold-400 font-bold hover:bg-slate-900 transition-all flex items-center gap-1 shadow"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Instalar Agora</span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg hover:bg-slate-950/20 text-slate-900 transition-colors"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
