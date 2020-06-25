import { PushSubscriptionViewModel } from '@shared/view-models/user/push-subscription.view-model';
import { sendNotification, setVapidDetails } from 'web-push';
import { notificationsService } from '../../app/notifications/notifications.service';
import { PushNotification as PushNotificationInterface } from '../../communication/interfaces/push-notification.interface';
import { CommentCreationPushNotificationModel } from '../../communication/models/push-notification/comment-creation-push-notification.model';
import { Database } from '../../core/database';
import { logger } from '../../core/utils/logger';
import { environment } from '../../environments/environment';
import { PushNotificationModel } from './push-notification.model';

class PushNotification implements PushNotificationInterface {

    async callDb(service: (res: any) => Promise<PushNotificationModel[] | null>, title: string): Promise<boolean> {
        const res = {
            locals: {
                neo4jSession: Database.createSession()
            }
        };

        const results = await service(res);

        res.locals.neo4jSession.close();

        if (results && results.length > 0) {
            const allPushSubscriptions = [];
            for (const result of results) {
                allPushSubscriptions.push(...result.pushSubscriptions);
            }

            return this.send(allPushSubscriptions, results[0].title ? results[0].title : title, results[0].body);
        } else {
            return true;
        }
    }

    async newComment(model: CommentCreationPushNotificationModel): Promise<boolean> {
        return this.callDb(async res => {
            return await notificationsService.getNewCommentNotification(res, model.commentUId);
        }, 'Item - Comment');
    }

    async send(pushSubscription: Array<PushSubscriptionViewModel | null | undefined>, title: string, body: string): Promise<boolean> {
        if (pushSubscription) {
            if (body) {
                body = body.substr(0, 230) + (body.length > 230 ? ' ...' : '');
            }

            setVapidDetails(`mailto:${environment.email.username}`, environment.vapidKey.public, environment.vapidKey.private);
            // TODO: not sure if this should be set setGCMAPIKey();

            const notificationOptions: NotificationOptions = {
                body,
                icon: 'assets/logo-color.png',
                data: {
                    dateOfArrival: Date.now()
                }
            };

            (notificationOptions as any).title = title;

            const notificationPayload = {
                notification: notificationOptions
            };

            try {
                const response = await Promise.all(
                    pushSubscription
                        .filter(sub => sub !== null && sub !== undefined)
                        .map((sub?: PushSubscriptionViewModel | null) =>
                            sendNotification((sub as PushSubscriptionViewModel), JSON.stringify(notificationPayload)))
                );

                // TODO: if one push notification fails it will cause a resend to all other receivers/users
                return response && response.every(result => result.statusCode >= 200) && response.every(result => result.statusCode < 300);
            } catch (error) {
                // TODO: this will potentially log errors to devices it can't send to which isn't that bug a deal or even an error
                logger.error('Error sending push notification', error);
                throw error;
            }
        } else {
            return true;
        }
    }
}

export const pushNotification = new PushNotification();
