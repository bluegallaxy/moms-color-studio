const CACHE_NAME = 'color-studio-shell-v2';
const APP_SHELL = ['./', './index.html', './manifest.json', './icon.svg', './ipad-layout.css'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith('color-studio-shell-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(async (response) => {
      if (!response.ok) return response;
      const html = await response.text();
      const patched = html.replace('</head>', '<link rel="stylesheet" href="./ipad-layout.css?v=2"></head>');
      const headers = new Headers(response.headers);
      headers.delete('content-length');
      const page = new Response(patched, { status: response.status, statusText: response.statusText, headers });
      const cache = await caches.open(CACHE_NAME);
      await cache.put('./index.html', page.clone());
      return page;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
    return response;
  })));
});
