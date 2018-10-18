import { PushNotification as PushNotificationInterface } from '../../communication/interfaces/push-notification.interface';
import { CommentCreationPushNotificationModel } from '../../communication/models/push-notification/comment-creation-push-notification.model';

class PushNotification implements PushNotificationInterface {
    async commentCreation(model: CommentCreationPushNotificationModel): Promise<boolean> {
        return false;
    }
}

export const pushNotification = new PushNotification();
