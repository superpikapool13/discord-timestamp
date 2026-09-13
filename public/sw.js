// Bump this when changing the APP_SHELL list below (adding/removing
// precached files). Not required for normal content updates - the
// network-first fetch strategy below already keeps cached content fresh
// on every successful online load.
const CACHE_NAME = 'discord-timestamp-v1';

// Paths are relative to this file's own location (the site's base path,
// e.g. /discord-timestamp/), so this works regardless of repo/domain.
const APP_SHELL = [
  './',
  './index.html',
  './assets/index.js',
  './assets/index.css',
  './favicon.svg',
  './favicon.ico',
  './favicon.png',
  './site.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

// Network-first: always try to fetch the latest version. Since core app
// files (index.js/index.css) aren't hash-named, this ensures updates are
// picked up immediately rather than needing a cache-busting URL change.
// Falls back to the cache only when the network request fails (offline).
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});