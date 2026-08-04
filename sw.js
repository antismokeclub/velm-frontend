// velm Service Worker — offline support + cache strategy
// Wymagany dla PWA -> TWA (Trusted Web Activity) na Play Store + iOS install
//
// Strategy:
// - HTML / app shell: network-first with cache fallback (refresh shows newest shell)
// - Static assets (icons, manifest): cache-first
// - API calls: network-first z fallback do offline page

const CACHE_VERSION = 'velm-v79';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/css/dashboard.css',
  '/js/dashboard.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  // Pre-cache app shell
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip API calls, OAuth callbacks, third-party
  if (url.pathname.startsWith('/api/') || url.hostname !== self.location.hostname) {
    return;
  }

  // HTML — network-first so manual refresh pulls the latest shell
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  // CSS i JS — network-first, tak samo jak HTML.
  // Muszą iść parą z powłoką: świeży dashboard.html z zakeszowanym starym
  // skryptem to wersja, której nigdy nie testowaliśmy. Bump CACHE_VERSION
  // czyści cache dopiero przy aktywacji nowego SW, a to bywa PO tym, jak
  // strona zdążyła pobrać swoje zasoby. Cache zostaje jako zapas offline.
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  // Reszta statyków (ikony, czcionki, JSON) — cache-first z fallbackiem do sieci
  if (request.destination === 'image' || request.destination === 'font' || url.pathname.endsWith('.json')) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return cached || new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}
