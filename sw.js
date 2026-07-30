self.addEventListener('push', function(event) {
  let data = { title: "Sweet Waffle Duyuru", body: "Yeni bir mesajınız var!" };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'logo.webp',
    badge: 'logo.webp',
    vibrate: [200, 100, 200],
    tag: 'sweet-waffle-notification',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') 
  );
});
