// velm Service Worker â€” offline support + cache strategy
// Wymagany dla PWA -> TWA (Trusted Web Activity) na Play Store + iOS install
//
// Strategy:
// - HTML / app shell: network-first with cache fallback (refresh shows newest shell)
// - Static assets (icons, manifest): cache-first
// - API calls: network-first z fallback do offline page

const CACHE_VERSION = 'velm-v108';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// UWAGA: cache.addAll jest ATOMOWE â€” jeden URL z 404 odrzuca cala liste, a
// .catch() nizej to polyka po cichu, wiec do cache nie trafia NIC. Po kazdej
// zmianie nazw plikow w js/dashboard/ trzeba poprawic te liste.
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/index.css',
  '/js/index.js',
  '/dashboard.html',
  '/css/dashboard.css',
  '/js/dashboard/01-core.js',
  '/js/dashboard/02-profil.js',
  '/js/dashboard/03-rozmowy.js',
  '/js/dashboard/04-home.js',
  '/js/dashboard/05-kalendarz.js',
  '/js/dashboard/06-statystyki-wspolne.js',
  '/js/dashboard/07-laboratorium.js',
  '/js/dashboard/08-statystyki.js',
  '/js/dashboard/09-nawigacja.js',
  '/js/dashboard/10-kreator-celu.js',
  '/js/dashboard/11-ustawienia.js',
  '/js/dashboard/12-i18n.js',
  '/js/dashboard/13-subskrypcja.js',
  '/js/dashboard/14-integracje.js',
  '/js/dashboard/15-historia.js',
  '/js/dashboard/16-narada.js',
  '/js/dashboard/17-czat.js',
  '/js/dashboard/18-dzis.js',
  '/js/dashboard/19-konto.js',
  '/js/dashboard/20-checkin.js',
  '/js/dashboard/21-start.js',
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

  // HTML â€” network-first so manual refresh pulls the latest shell
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  // CSS i JS â€” network-first, tak samo jak HTML.
  // MuszÄ… iĹ›Ä‡ parÄ… z powĹ‚okÄ…: Ĺ›wieĹĽy dashboard.html z zakeszowanym starym
  // skryptem to wersja, ktĂłrej nigdy nie testowaliĹ›my. Bump CACHE_VERSION
  // czyĹ›ci cache dopiero przy aktywacji nowego SW, a to bywa PO tym, jak
  // strona zdÄ…ĹĽyĹ‚a pobraÄ‡ swoje zasoby. Cache zostaje jako zapas offline.
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  // Reszta statykĂłw (ikony, czcionki, JSON) â€” cache-first z fallbackiem do sieci
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
