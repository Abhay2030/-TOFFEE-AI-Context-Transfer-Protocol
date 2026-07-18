const CACHE_NAME = 'toffee-pwa-cache-v1';

// We just cache the app shell (static assets) to make the PWA load instantly
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Stale-While-Revalidate Strategy for all GET requests to our own origin
  if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
    // Exclude API calls from aggressive SW caching
    if (event.request.url.includes('/api/')) {
      return;
    }

    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        });

        // Return the cached response immediately if available, otherwise wait for the network
        return cachedResponse || fetchPromise;
      })
    );
  }
});
