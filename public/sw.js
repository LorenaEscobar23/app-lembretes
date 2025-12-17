const CACHE_NAME = 'app-lembretes-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Alguns assets podem não estar disponíveis durante o build, e está tudo bem
      });
    })
  );
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar Firebase e requisições externas
  if (
    event.request.url.includes('firebaseio.com') ||
    event.request.url.includes('googleapis.com') ||
    event.request.url.includes('netlify')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone a resposta
        const clonedResponse = response.clone();

        // Guardar no cache para uso offline
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });

        return response;
      })
      .catch(() => {
        // Se a requisição falhar, tentar pegar do cache
        return caches.match(event.request).then((response) => {
          return response || new Response('Offline - recurso não disponível', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' }),
          });
        });
      })
  );
});

// Background sync para notificações
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(
      // Sincronizar dados quando a conexão voltar
      fetch('/api/sync')
        .then(() => {
          // Notificação após sincronização
          self.registration.showNotification('✅ Dados Sincronizados', {
            body: 'Seus lembretes foram atualizados',
            icon: '/logo.png',
            badge: '/badge.png',
          });
        })
        .catch(() => {
          // Erro na sincronização
        })
    );
  }
});
