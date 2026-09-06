/**
 * Utility module for PWA Push Notifications and Audio Alerts in BJuris
 */

// Simple audio beep generator using Web Audio API (no external mp3 file needed)
export const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // First tone (G5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(783.99, ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.2);

    // Second tone (C6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.45);
  } catch (err) {
    console.warn('Web Audio API not allowed or supported yet', err);
  }
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    alert('Seu navegador não suporta notificações de sistema.');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
};

export const sendNativeNotification = (
  title: string,
  options?: NotificationOptions & { playSound?: boolean }
) => {
  if (options?.playSound !== false) {
    playNotificationSound();
  }

  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          ...(options as any)
        });
      });
    } else {
      new Notification(title, {
        icon: '/icon-192.png',
        ...options
      });
    }
  }
};

export const triggerDeadlineAlert = (tituloPrazo: string, processoCnj: string) => {
  sendNativeNotification(`⚠️ PRAZO FATAL: ${tituloPrazo}`, {
    body: `Processo: ${processoCnj}\nAtenção: Prazo prestes a expirar! Verifique no BJuris.`,
    tag: 'prazo-fatal-alert',
    requireInteraction: true,
    playSound: true
  });
};
