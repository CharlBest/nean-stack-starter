import { sendNotification, setVapidDetails } from 'web-push';
import { PushSubscriptionModel } from '../../../shared/models/user/push-subscription.model';
import { environment } from '../../environments/environment';
import { logger } from './logger';

class PushNotification {
    async send(pushSubscription: PushSubscriptionModel | null | undefined, title: string, body: string): Promise<void> {
        if (pushSubscription) {
            if (body) {
                body = body.substr(0, 230) + (body.length > 230 ? ' ...' : '');
            }

            setVapidDetails('mailto:admin@nean.io', environment.vapidKey.public, environment.vapidKey.private);
            // setGCMAPIKey();

            const notificationOptions: NotificationOptions = {
                body: body,
                icon: 'assets/logo-color.png',
                data: {
                    dateOfArrival: Date.now()
                }
            };

            notificationOptions['title'] = title;

            const notificationPayload = {
                notification: notificationOptions
            };

            // Promise.all(allSubscriptions.map(sub => sendNotification(sub, JSON.stringify(notificationPayload))))
            //     .then(() => logger.info('Push notifications sent', [notificationPayload]))
            //     .catch(err => {
            //         console.error('Error sending notification, reason: ', err);
            //     });

            sendNotification(pushSubscription, JSON.stringify(notificationPayload))
                .then(() => logger.info('Push notifications sent', [notificationPayload]))
                .catch(error => {
                    logger.error('Error seding push notifications', [error]);
                });
        }
    }
}

export const pushNotification = new PushNotification();
