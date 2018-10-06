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
}
