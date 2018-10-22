import { sendNotification, setVapidDetails } from 'web-push';
import { PushSubscriptionViewModel } from '../../../shared/view-models/user/push-subscription.view-model';
import { PushNotification as PushNotificationInterface } from '../../communication/interfaces/push-notification.interface';
import { CommentCreationPushNotificationModel } from '../../communication/models/push-notification/comment-creation-push-notification.model';
import { environment } from '../../environments/environment';

class PushNotification implements PushNotificationInterface {
    async commentCreation(model: CommentCreationPushNotificationModel): Promise<boolean> {
        return false;
    }

    async send(pushSubscription: PushSubscriptionViewModel | null | undefined, title: string, body: string): Promise<boolean> {
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

            try {
                const response = await sendNotification(pushSubscription, JSON.stringify(notificationPayload));

                return response && response.statusCode >= 200 && response.statusCode < 300;
            } catch (error) {
                throw error;
            }
        } else {
            return true;
        }
    }
}

export const pushNotification = new PushNotification();
