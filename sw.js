/*
//With work

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js"
);

workbox.routing.registerRoute(
  new RegExp(".*.js"),
  workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: "css-cache"
  })
);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: "image-cache",
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 20,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60
      })
    ]
  })
);
*/

// Without workbox

const staticAssets = [
  "./",
  "./styles.css",
  "./app.js",
  "./fallback.json",
  "./images/fallback.jpg"
];
self.addEventListener("install", async e => {
  const cache = await caches.open("news-static");
  cache.addAll(staticAssets);
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open("news-dynamic");
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || (await caches.match("./fallback.json"));
  }
}
