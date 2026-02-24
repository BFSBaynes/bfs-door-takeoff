const CACHE_NAME = "door-takeoff-OLD-v1"; // Distinct name
const ASSETS = [
  "./",
  "./classic.html",           // Points to the version they like
  "./manifest-old.json",   // We will create this next
  "./service-worker-old.js",
  "./icon-192.png",
  "./icon-512.png"
];

// Install: Cache all files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: Cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          // Only delete caches that belong to THIS version
          if (k.includes("door-takeoff-OLD") && k !== CACHE_NAME) {
             return caches.delete(k);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network first, fallback to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
