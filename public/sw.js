// BJuris Service Worker - v3
// Estratégia: Network First (busca do servidor, cache como fallback offline)
// Isso garante que atualizações do site sempre carregam imediatamente.

const CACHE_NAME = 'bjuris-v3';
const OFFLINE_FALLBACK = '/index.html';

// ─── Install: pré-cache apenas o essencial ────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_FALLBACK, '/manifest.json']);
    })
  );
  // Ativa imediatamente sem esperar a aba fechar
  self.skipWaiting();
});

// ─── Activate: limpa TODOS os caches antigos ─────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Removendo cache antigo:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Assume controle de todas as abas abertas imediatamente
      return self.clients.claim();
    })
  );
});

// ─── Fetch: Network First ─────────────────────────────────────────────────
// Tenta buscar do servidor. Se falhar (offline), usa cache.
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-GET e requests para outros domínios
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Atualiza o cache com a resposta fresca do servidor
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline: retorna do cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Para navegação, retorna o index.html (SPA fallback)
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_FALLBACK);
          }
        });
      })
  );
});

// ─── Push Notification Handler ────────────────────────────────────────────
self.addEventListener('push', (event) => {
  let data = { title: 'BJuris Alerta', body: 'Nova atualização no seu sistema jurídico.' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ─── Notification Click Handler ───────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow(event.notification.data.url || '/');
    })
  );
});
