/**
 * EchoShadow 1314 - Service Worker (v2)
 * Enables PWA installation on Android (Pixel WebAPK) & iOS Safari.
 * Caches core assets for offline usage.
 */

const CACHE_NAME = "echoshadow-v2";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/qrcode.js",
  "./js/database.js",
  "./js/speech.js",
  "./js/recorder.js",
  "./js/api.js",
  "./js/app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-64.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Use individual caching to prevent one failed asset from halting the entire install
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn("[SW] Asset caching notice for:", asset, err);
        }
      }
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Pass non-GET and API requests directly
  if (event.request.method !== "GET" || event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache valid responses for offline use
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Safe HTML fallback
        const acceptHeader = event.request.headers.get("accept") || "";
        if (acceptHeader.includes("text/html")) {
          return caches.match("./index.html") || caches.match("./");
        }
      });
    })
  );
});

