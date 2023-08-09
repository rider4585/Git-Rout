// Service Worker script (sw.js)

const CACHE_NAME = 'your-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.css',
  '/index.js'
  // Add more URLs to cache here
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        return response; // Serve from cache
      }

      // Fetch from network and cache the response
      return fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response; // Don't cache non-200 responses or non-basic types
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
    })
  );
});