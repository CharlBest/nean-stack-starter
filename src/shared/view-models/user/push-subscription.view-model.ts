import { PushSubscription } from 'web-push';
import { PushSubscriptionValues } from '../../models/user/user.model';

export class PushSubscriptionViewModel implements PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };

    constructor(endpoint: string, auth: string, p256dh: string) {
        this.endpoint = endpoint;
        this.keys = {
            p256dh,
            auth
        };
    }

    static createFromArray(pushSubscription: PushSubscriptionValues): PushSubscriptionViewModel | null {
        if (pushSubscription) {
            // NOTE: The order of this tuple is very important and should not be changed
            const [endpoint, auth, p256dh] = pushSubscription;
            return new PushSubscriptionViewModel(endpoint, auth, p256dh);
        } else {
            return null;
        }
    }

    static createArray(endpoint: string, auth: string, p256dh: string): PushSubscriptionValues {
        // NOTE: The order of this tuple is very important and should not be changed
        return [endpoint, auth, p256dh];
    }
}
