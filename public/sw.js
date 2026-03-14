// Service Worker for Bohol Travel Agency PWA
const CACHE_NAME = 'bohol-travel-v1';
const urlsToCache = [
  '/',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch(() => {
          // Some resources might fail to cache, continue anyway
        });
      })
  );
  self.skipWaiting();
});

// Activate event
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

// Fetch event - Network first, cache fallback
self.addEventListener('fetch', (event) => {
  // Don't cache API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response('Network error', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        // Clone the response
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone);
          });
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then((response) => {
            return response || new Response('Offline - Resource not cached', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

