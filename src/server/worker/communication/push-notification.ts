import { sendNotification, setVapidDetails } from 'web-push';
import { PushSubscriptionViewModel } from '../../../shared/view-models/user/push-subscription.view-model';
import { notificationsService } from '../../app/notifications/notifications.service';
import { PushNotification as PushNotificationInterface } from '../../communication/interfaces/push-notification.interface';
// tslint:disable-next-line:max-line-length
import { CommentCreationPushNotificationModel } from '../../communication/models/push-notification/comment-creation-push-notification.model';
import { Database } from '../../core/database';
import { environment } from '../../environments/environment';

class PushNotification implements PushNotificationInterface {

    async callDb(service: (res: any) => Promise<any>, title: string): Promise<boolean> {
        const res = {
            locals: {
                neo4jSession: Database.createSession()
            }
        };

        const result = await service(res);

        res.locals.neo4jSession.close();

        if (result) {
            return this.send(result.pushSubscriptions, result.title ? result.title : title, result.body);
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

            setVapidDetails('mailto:admin@nean.io', environment.vapidKey.public, environment.vapidKey.private);
            // setGCMAPIKey();

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
                        .map((sub: PushSubscriptionViewModel) => sendNotification(sub, JSON.stringify(notificationPayload)))
                );

                // TODO: if one push notification fails it will cause a resend to all other receivers/users
                return response && response.every(result => result.statusCode >= 200) && response.every(result => result.statusCode < 300);
            } catch (error) {
                throw error;
            }
        } else {
            return true;
        }
    }
}

export const pushNotification = new PushNotification();
