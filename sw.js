self.addEventListener('push', function(event) {
    let data = { 
        title: 'Sweet Waffle - Yeni Duyuru', 
        body: 'Merkezden yeni bir mesaj var.',
        type: 'general'
    };
    
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    let notificationTag = 'sweet-waffle-broadcast';
    let vibrationPattern = [200, 100, 200];
    let notificationTitle = data.title;
    let notificationBody = data.body;

    // Mola bitişi için özel ayarlar
    if (data.type === 'break_end') {
        notificationTag = 'sweet-waffle-break-alarm';
        notificationTitle = data.title || 'Mola Süresi Bitti!';
        notificationBody = data.body || 'Mola süreniz sona erdi, işbaşı yapabilirsiniz.';
        vibrationPattern = [300, 150, 300]; // Mola için kısa/ritmik titreşim
    } 
    // Yemek çıkışı/bitişi için özel ayarlar
    else if (data.type === 'meal_end') {
        notificationTag = 'sweet-waffle-meal-alarm';
        notificationTitle = data.title || 'Yemek Molası Bitti!';
        notificationBody = data.body || 'Yemek süreniz sona erdi, çalışma alanına dönebilirsiniz.';
        vibrationPattern = [500, 200, 500, 200, 500]; // Yemek için daha uzun ve dikkat çekici titreşim
    }

    const options = {
        body: notificationBody,
        icon: 'logo.webp',
        badge: 'logo.webp',
        vibrate: vibrationPattern,
        tag: notificationTag,
        renotify: true,
        data: data
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) return client.focus();
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
