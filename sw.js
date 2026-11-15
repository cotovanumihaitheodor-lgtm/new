// Ține interfața în telefon: se deschide instant și fără internet; se actualizează în fundal.
const C = 'nal-v9';
const SHELL = ['./', './index.html', './icon-180.png', './icon-192.png', './manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;   // datele merg mereu la server
  e.respondWith(caches.open(C).then(c => c.match(r, { ignoreSearch: true }).then(hit => {
    const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit || c.match('./index.html'));
    return hit || net;
  })));
});
