const CACHE_NAME = "uangku-cache-v1";
const ASSETS_TO_CACHE = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "manifest.json",
  "icon.svg",
  "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
];

// Install Event - Caches all assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching all static shell files");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Cleans up old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serves from cache first, falls back to network
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version immediately
        return cachedResponse;
      }
      
      // Fallback to fetch from network
      return fetch(e.request).then((networkResponse) => {
        // Only cache valid standard GET requests (e.g. Google Font files requested dynamically)
        if (
          !networkResponse || 
          networkResponse.status !== 200 || 
          networkResponse.type !== "basic" ||
          e.request.method !== "GET"
        ) {
          return networkResponse;
        }

        // Cache the newly fetched file dynamically
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline fallback if network fails
        console.log("[Service Worker] Network request failed and no cache hit.");
      });
    })
  );
});
