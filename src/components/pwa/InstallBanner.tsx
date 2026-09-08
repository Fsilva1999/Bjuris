import React, { useState, useEffect } from 'react';
import { useLegal } from '../../context/LegalContext';
import { Smartphone, Download, X, HelpCircle, Bell, Volume2, CheckCircle2, Share } from 'lucide-react';
import { requestNotificationPermission, sendNativeNotification } from '../../utils/pwaNotifications';

export const InstallBanner: React.FC = () => {
  const { canInstallPwa, installPwa } = useLegal();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    return localStorage.getItem('bjuris_pwa_banner_dismissed') === 'true';
  });
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if app is already running as an installed PWA on mobile or desktop
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      window.matchMedia('(display-mode: minimal-ui)').matches;
    setIsStandalone(standalone);

    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('bjuris_pwa_banner_dismissed', 'true');
  };

  const handleAuthorizeNotifications = async () => {
    const perm = await requestNotificationPermission();
    setPermission(perm);
    if (perm === 'granted') {
      sendNativeNotification('🔔 Notificações do BJuris Ativadas!', {
        body: 'Você receberá alertas sonoros para prazos e audiências.',
        playSound: true
      });
      alert('✅ Notificações e alertas sonoros autorizados com sucesso!');
    }
  };

  // DO NOT show the install banner card if app is running installed in standalone mode OR if dismissed
  if (isStandalone) return null;
  if (dismissed && !showGuideModal) return null;

  return (
    <>
      {/* Top PWA Banner */}
      {!dismissed && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-slate-900 text-white px-4 py-2.5 shadow-xl flex items-center justify-between text-xs font-medium z-40 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5 max-w-4xl mx-auto flex-1">
            <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950 flex-shrink-0">
              <Smartphone className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-1">
              <span className="font-extrabold uppercase tracking-wider text-[11px] text-amber-300">Aplicativo BJuris</span>
              <p className="text-[11px] text-slate-100 leading-tight">
                Instale no seu celular/PC para acessar offline e receber alertas sonoros de prazos!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {canInstallPwa && (
              <button
                onClick={installPwa}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition-all flex items-center gap-1 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar</span>
              </button>
            )}

            <button
              onClick={() => setShowGuideModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-all flex items-center gap-1 border border-slate-700"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Como Instalar</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Full Guide Modal for iOS, Android & Desktop */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto text-slate-100 space-y-5">
            
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-3 rounded-xl bg-amber-500/20 text-[#d4af37] border border-amber-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-100">Como Instalar o BJuris no Celular ou PC</h3>
                <p className="text-xs text-amber-400 font-bold">Passo a passo rápido para iPhone, Android e Computador</p>
              </div>
            </div>

            {/* Notification Permission Card */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
                  Passo Oculto Ofertado: Autorizar Notificações de Prazos
                </h4>
                {permission === 'granted' && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ativado
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                Para ouvir o alarme sonoro e receber lembretes de prazos no celular mesmo com o app fechado:
              </p>
              {permission !== 'granted' && (
                <button
                  onClick={handleAuthorizeNotifications}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Volume2 className="w-4 h-4" />
                  🔔 Autorizar Notificações e Som de Prazos Agora
                </button>
              )}
            </div>

            {/* Device-Specific Instructions */}
            <div className="space-y-4 text-xs">
              
              {/* iPhone / iPad */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <h4 className="font-extrabold text-amber-400 flex items-center gap-2 text-sm">
                  <span>🍎 iPhone & iPad (Safari iOS)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 font-medium leading-relaxed">
                  <li>Abra o aplicativo no navegador <strong>Safari</strong> do iPhone.</li>
                  <li>Toque no botão de <strong>Compartilhar</strong> <Share className="w-3.5 h-3.5 inline text-amber-400" /> (quadrado com seta para cima na barra inferior).</li>
                  <li>Role para baixo e selecione a opção <strong>"Adicionar à Tela de Início"</strong>.</li>
                  <li>Confirme em <strong>Adicionar</strong>. O ícone do BJuris aparecerá na sua tela inicial!</li>
                </ol>
              </div>

              {/* Android */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <h4 className="font-extrabold text-emerald-400 flex items-center gap-2 text-sm">
                  <span>🤖 Android (Chrome / Edge / Samsung)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 font-medium leading-relaxed">
                  {canInstallPwa ? (
                    <li>Clique no botão <strong>"Instalar"</strong> acima ou no menu do navegador.</li>
                  ) : (
                    <li>Toque nos <strong>3 pontinhos `⋮`</strong> no canto superior direito do navegador.</li>
                  )}
                  <li>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à Tela Inicial"</strong>.</li>
                  <li>Pronto! O aplicativo funcionará exatamente como um app nativo da Play Store.</li>
                </ol>
              </div>

              {/* PC / Laptop */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <h4 className="font-extrabold text-blue-400 flex items-center gap-2 text-sm">
                  <span>💻 Computador (Windows / Mac)</span>
                </h4>
                <p className="text-slate-300 font-medium leading-relaxed">
                  Clique no ícone de atalho de instalação <strong>`⊕`</strong> localizado do lado direito da barra de endereço do seu navegador (Chrome/Edge/Brave).
                </p>
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors shadow-md"
              >
                Entendi, Fechar Guia
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
