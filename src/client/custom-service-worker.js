importScripts('./ngsw-worker.js');

(function () {
    'use strict';

    self.addEventListener('notificationclick', event => {
        console.log('Notification details: ', event.notification);
        console.log('Notification actions: ', event.action);
        event.notification.close();

        if (clients.openWindow) {
            const rootUrl = new URL('/', location).href;
            const url = new URL(event.notification.data.url || '/', location).href;

            // Enumerate windows, and call window.focus(), or open a new one.
            event.waitUntil(
                clients.matchAll().then(matchedClients => {
                    console.log('Matched clients: ', matchedClients);
                    for (let client of matchedClients) {
                        if (client.url === rootUrl) {
                            return client.navigate(url).then(navClient => navClient.focus());
                        }
                    }
                    return clients.openWindow(url);
                })
            );
        }
    });
}());