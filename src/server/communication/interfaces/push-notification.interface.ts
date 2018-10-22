import { CommentCreationPushNotificationModel } from '../models/push-notification/comment-creation-push-notification.model';

export interface PushNotification {
    newComment(model: CommentCreationPushNotificationModel): void;
}
