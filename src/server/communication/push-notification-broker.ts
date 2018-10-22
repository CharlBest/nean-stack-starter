import { brokerManager } from '../broker/broker-manager';
import { QueueType } from '../broker/queue-type.enum';
import { PushNotification } from './interfaces/push-notification.interface';
import { CommentCreationPushNotificationModel } from './models/push-notification/comment-creation-push-notification.model';

class PushNotificationBroker implements PushNotification {
    newComment(model: CommentCreationPushNotificationModel) {
        brokerManager.sendToQueue(QueueType.newCommentPushNotification, model);
    }
}

export const pushNotificationBroker = new PushNotificationBroker();
