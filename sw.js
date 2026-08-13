self.addEventListener('push', function(event) {
    let data = { title: 'Sweet Waffle - Bilgilendirme', body: 'Süreniz güncellendi.' };
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    // Mola veya yemek bitişi için özel başlık/etiket ayrımı
    let notificationTag = 'sweet-waffle-broadcast';
    if (data.type === 'break_end') {
        notificationTag = 'sweet-waffle-break-alarm';
    }

    const options = {
        body: data.body,
        icon: 'logo.webp',
        badge: 'logo.webp',
        vibrate: [300, 150, 300, 150, 300], // Daha belirgin titreşim
        tag: notificationTag,
        renotify: true,
        data: data // Gelen veriyi tıklama olayında kullanabilmek için sakla
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    // Bildirime tıklandığında mola türüne göre yönlendirme yapılabilir
    const notificationData = event.notification.data;

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
