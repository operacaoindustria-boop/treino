const notificationIcon = 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png';

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC56zt9xGfusTYmp1XtEGneig1uhf9ZR7Q',
  authDomain: 'farmtell-beef-analytics.firebaseapp.com',
  projectId: 'farmtell-beef-analytics',
  storageBucket: 'farmtell-beef-analytics.firebasestorage.app',
  messagingSenderId: '686184908638',
  appId: '1:686184908638:web:99b39d498a5f8d38c8b1cf'
});

const firebaseMessaging = firebase.messaging();
firebaseMessaging.onBackgroundMessage(payload => {
  const notification = payload.notification || payload.data || {};
  self.registration.showNotification(notification.title || 'Titan OS', {
    body: notification.body || 'Novo alerta',
    icon: notification.icon || notificationIcon,
    badge: notificationIcon,
    vibrate: [300, 100, 300],
    requireInteraction: true,
    data: { url: notification.url || './' }
  });
});

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
