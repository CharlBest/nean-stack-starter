import { PushSubscriptionViewModel } from '@shared/view-models/user/push-subscription.view-model';

export class PushNotificationModel {
    pushSubscriptions: Array<PushSubscriptionViewModel>;
    title: string;
    body: string;
}
