import { PushSubscription } from 'web-push';

export class PushSubscriptionModel implements PushSubscription {
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

    static createFromArray(pushSubscription: PushSubscriptionValues): PushSubscriptionModel | null {
        if (pushSubscription) {
            const [endpoint, auth, p256dh] = pushSubscription;
            return new PushSubscriptionModel(endpoint, auth, p256dh);
        } else {
            return null;
        }
    }

    static createArray(endpoint: string, auth: string, p256dh: string): PushSubscriptionValues {
        return [endpoint, auth, p256dh];
    }
}

type PushSubscriptionValues = [string, string, string];
