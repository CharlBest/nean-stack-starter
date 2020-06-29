importScripts('./ngsw-worker.js');

(function () {
    'use strict';

    self.addEventListener('notificationclick', event => {
        console.log('Notification details: ', event.notification);
        event.notification.close();

        if (clients.openWindow) {
            const rootOrigin = new URL('/', location).origin;
            const url = new URL(event.notification.data.url || '/', location).href;

            // Enumerate windows, and call window.focus(), or open a new one.
            event.waitUntil(
                clients.matchAll().then(matchedClients => {
                    console.log('Matched clients: ', matchedClients);
                    for (let client of matchedClients) {
                        const clientOrigin = new URL(client.url).origin;
                        if (clientOrigin === rootOrigin) {
                            return client.navigate(url).then(navClient => navClient.focus());
                        }
                    }
                    return clients.openWindow(url);
                })
            );
        }
    });
}());