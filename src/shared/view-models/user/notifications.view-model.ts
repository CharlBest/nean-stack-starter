import { EmailNotificationTypes, NotificationType, PushNotificationTypes } from '../../models/user/user.model';

export class NotificationsViewModel {

    constructor(pushNotificationTypes: PushNotificationTypes, emailNotificationTypes: EmailNotificationTypes) {
        if (pushNotificationTypes) {
            const [pushCommentOnItemToOwner, pushHot] = pushNotificationTypes;
            this.pushCommentOnItemToOwner = pushCommentOnItemToOwner;
            this.pushHot = pushHot;
        }

        if (emailNotificationTypes) {
            const [emailCommentOnItemToOwner, emailHot] = emailNotificationTypes;
            this.emailCommentOnItemToOwner = emailCommentOnItemToOwner;
            this.emailHot = emailHot;
        }
    }

    pushCommentOnItemToOwner: NotificationType;
    pushHot: NotificationType;

    emailCommentOnItemToOwner: NotificationType;
    emailHot: NotificationType;

    static createPushNotificationArray(pushCommentOnItemToOwner: NotificationType, pushHot: NotificationType) {
        return [pushCommentOnItemToOwner, pushHot];
    }

    static createEmailNotificationArray(emailCommentOnItemToOwner: NotificationType, emailHot: NotificationType) {
        return [emailCommentOnItemToOwner, emailHot];
    }
}


