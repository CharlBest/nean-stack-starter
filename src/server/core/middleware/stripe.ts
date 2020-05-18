import Stripe from 'stripe';
import { environment } from '../../environments/environment';

class Helper {
    constructor() { }
}

export const helper = new Helper();
export const stripe = new Stripe(environment.stripe.secretKey, {
    apiVersion: '2020-03-02',
    typescript: true
});