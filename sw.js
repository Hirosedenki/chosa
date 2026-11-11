// 現場調査報告書：圏外でも開けるようにアプリ本体をキャッシュ
const CACHE = 'chosa-houkokusho-v1';
const FILES = ['./', 'index.html', 'jszip.min.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('chosa-') && k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
// 通信できるときは最新版、圏外のときはキャッシュを使う
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request, {ignoreSearch: true})));
});
