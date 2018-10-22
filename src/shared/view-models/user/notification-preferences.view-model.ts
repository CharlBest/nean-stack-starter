import { EmailNotificationTypes, PushNotificationTypes } from '../../models/user/user.model';
import { NotificationsViewModel } from './notifications.view-model';

export class NotificationPreferencesViewModel extends NotificationsViewModel {

    constructor(pushNotificationTypes: PushNotificationTypes, emailNotificationTypes: EmailNotificationTypes) {
        super(pushNotificationTypes, emailNotificationTypes);
    }

    hasPushSubscription: boolean;
    pushNotificationEnabled: boolean;
    emailEnabled: boolean;
    autoSubscribeToItem: boolean;
}
