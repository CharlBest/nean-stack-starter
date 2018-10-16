import { EmailNotificationTypes, NotificationType, PushNotificationTypes } from '../../models/user/user.model';

export class NotificationsViewModel {

    constructor(pushNotificationTypes: PushNotificationTypes, emailNotificationTypes: EmailNotificationTypes) {
        if (pushNotificationTypes) {
            // NOTE: The order of this tuple is very important and should not be changed
            const [pushCommentOnItemToOwner, pushHot] = pushNotificationTypes;
            this.pushCommentOnItemToOwner = pushCommentOnItemToOwner;
            this.pushHot = pushHot;
        }

        if (emailNotificationTypes) {
            // NOTE: The order of this tuple is very important and should not be changed
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
        // NOTE: The order of this tuple is very important and should not be changed
        return [pushCommentOnItemToOwner, pushHot];
    }

    static createEmailNotificationArray(emailCommentOnItemToOwner: NotificationType, emailHot: NotificationType) {
        // NOTE: The order of this tuple is very important and should not be changed
        return [emailCommentOnItemToOwner, emailHot];
    }
}


