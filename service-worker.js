const notificationIcon = 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Titan OS', body: 'Novo alerta' };
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon || notificationIcon,
    badge: notificationIcon,
    vibrate: [300, 100, 300],
    requireInteraction: true,
    data: { url: data.url || './' }
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
    const targetUrl = new URL(event.notification.data?.url || './', self.location.origin).href;
    for (const client of clientList) {
      if ('focus' in client) {
        client.navigate(targetUrl);
        return client.focus();
      }
    }
    return clients.openWindow(targetUrl);
  }));
});
