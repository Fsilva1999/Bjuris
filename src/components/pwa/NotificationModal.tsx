import React, { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle2, ShieldAlert, Volume2 } from 'lucide-react';
import { requestNotificationPermission, sendNativeNotification } from '../../utils/pwaNotifications';

export const NotificationModal: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'default') {
        setShowBanner(true);
      }
    }
  }, []);

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setPermission(perm);
    if (perm === 'granted') {
      sendNativeNotification('🔔 BJuris Notificações Ativadas!', {
        body: 'Você receberá avisos sonoros e vibração para todos os prazos urgentes.',
        playSound: true
      });
      setShowBanner(false);
    }
  };

  if (!showBanner || permission === 'granted') return null;

  return (
    <div className="fixed bottom-20 right-4 left-4 sm:left-auto sm:w-96 glass-panel rounded-2xl p-4 border border-gold-500/30 shadow-2xl z-50 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30 flex-shrink-0">
          <Bell className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1">
            Ativar Notificações de Prazos?
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
            Receba alertas de audiências, prazos fatais do CPC e intimações diretamente no celular ou computador.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1.5 rounded-lg bg-gold-500 text-slate-950 font-bold text-xs hover:bg-gold-400 transition-all shadow-md flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Ativar Notificações
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 text-xs transition-colors"
            >
              Agora Não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
