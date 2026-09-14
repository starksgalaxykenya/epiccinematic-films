/* ============================================================
   EPIC CINEMATIC FILMS — Service Worker
   ============================================================ */

const CACHE_NAME = 'epic-cinematic-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/css/tokens.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/components.css',
  '/css/pages.css',
  '/js/app.js',
  '/js/router.js',
  '/js/firebase-config.js',
  '/js/auth.js',
  '/js/db.js',
  '/js/components/nav.js',
  '/js/components/footer.js',
  '/js/components/card.js',
  '/js/components/modal.js',
  '/js/utils/dom.js',
  '/js/utils/format.js',
  '/js/utils/toast.js',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

/* --- Install: pre-cache static assets --- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Pre-cache failed:', err))
  );
});

/* --- Activate: clean old caches --- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* --- Fetch: network-first for Firebase, cache-first for static --- */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and Firebase/Firestore requests (always network)
  if (request.method !== 'GET') return;
  if (url.origin.includes('firestore.googleapis.com') ||
      url.origin.includes('identitytoolkit.googleapis.com')) return;

  // Navigation requests: network-first, fallback to offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok && url.origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
