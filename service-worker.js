const CACHE_NAME = "door-takeoff-v2.7.0"; // Increment this every time you push a fix
const ASSETS = [
  "./",
  "./index.html",
  "./classic.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install: Cache all essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets...");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Force the waiting service worker to become the active one
});

// Activate: Cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            console.log("Removing old cache:", k);
            return caches.delete(k);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all open tabs/windows immediately
});

// Fetch: NETWORK-FIRST for HTML, Cache-First for Assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // If it's a webpage (HTML), try the network first so we get updates immediately
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Update the cache with the fresh version we just grabbed
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(event.request)) // If offline (dead zone), use the cache
    );
  } else {
    // For images, icons, and manifest, use the Cache-First strategy
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
