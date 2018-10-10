import { NotificationPreferencesViewModel } from './notification-preferences.view-model';
import { PushSubscriptionViewModel } from './push-subscription.view-model';

export class UpdateNotificationPreferencesViewModel {
    notificationPreferences: NotificationPreferencesViewModel;
    pushSubscription: PushSubscriptionViewModel | null;
}
