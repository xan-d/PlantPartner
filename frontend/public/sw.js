self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/web-app-manifest-192x192.png',
    data: { url: data.url || '/plants' }
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  clients.openWindow(event.notification.data.url);
});