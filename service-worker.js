const CACHE_NAME = "door-takeoff-v2.1.1"; // Increment this to force an update
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
  self.skipWaiting();
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
  self.clients.claim();
});

// Fetch: CACHE-FIRST (Faster for Job Sites)
// This checks the cache first. If found, it loads instantly.
// If not found, it goes to the network.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
