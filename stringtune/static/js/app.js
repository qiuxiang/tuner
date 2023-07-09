self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('roasting-time-calculator-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/styles.css',
        '/js/app.js',
        '/images/icon.png',
        // Add all other assets your app requires to work offline
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

