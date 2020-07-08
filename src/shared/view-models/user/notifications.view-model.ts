import { EmailNotificationTypes, NotificationType, PushNotificationTypes } from '../../models/user/user.model';

export class NotificationsViewModel {

    constructor(pushNotificationTypes: PushNotificationTypes, emailNotificationTypes: EmailNotificationTypes) {
        if (pushNotificationTypes) {
            // NOTE: The order of this tuple is very important and should not be changed
            const [pushNewComment, pushHot] = pushNotificationTypes;
            this.pushNewComment = pushNewComment;
            this.pushHot = pushHot;
        }

        if (emailNotificationTypes) {
            // NOTE: The order of this tuple is very important and should not be changed
            const [emailNewComment, emailHot] = emailNotificationTypes;
            this.emailNewComment = emailNewComment;
            this.emailHot = emailHot;
        }
    }

    pushNewComment: NotificationType;
    pushHot: NotificationType;

    emailNewComment: NotificationType;
    emailHot: NotificationType;

    static createPushNotificationArray(pushNewComment: NotificationType, pushHot: NotificationType): Array<NotificationType> {
        // NOTE: The order of this tuple is very important and should not be changed
        return [pushNewComment, pushHot];
    }

    static createEmailNotificationArray(emailNewComment: NotificationType, emailHot: NotificationType): Array<NotificationType> {
        // NOTE: The order of this tuple is very important and should not be changed
        return [emailNewComment, emailHot];
    }
}


