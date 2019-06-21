import { NotificationPreferencesViewModel } from './notification-preferences.view-model';
import { PushSubscriptionViewModel } from './push-subscription.view-model';

export class UpdateNotificationPreferencesViewModel {
    preferences: NotificationPreferencesViewModel;
    pushSubscription: PushSubscriptionViewModel | null;
}
