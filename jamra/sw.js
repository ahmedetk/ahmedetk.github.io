// Kill switch for the old jamra service worker at ahmedetk.github.io/jamra/.
// Returning visitors still have the old app's service worker; the browser fetches this file as its update,
// it removes itself and the old caches, and sends every open jamra page to the same page at the new address.
const NEW_ORIGIN = 'https://astrobyteps.github.io';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try { await Promise.all((await caches.keys()).map((k) => caches.delete(k))); } catch (e) { /* ignore */ }
    await self.registration.unregister();
    const pages = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    pages.forEach((c) => {
      const u = new URL(c.url);
      if (/^\/jamra(\/|$)/.test(u.pathname)) c.navigate(NEW_ORIGIN + u.pathname + u.search + u.hash).catch(() => {});
    });
  })());
});

// until it is gone, never serve anything from cache: go to the network (the redirect pages)
self.addEventListener('fetch', () => {});
