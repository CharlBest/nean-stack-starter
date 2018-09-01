import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from '../../../environments/environment';

declare var Stripe: any;

@Injectable({
    providedIn: 'root'
})
export class StripeElementsService {

    @Output() stripeInitialized: EventEmitter<boolean> = new EventEmitter<boolean>();
    stripeInstance;

    constructor(private http: HttpClient) {
        this.initializeStripe();
    }

    get stripe() {
        if (!this.stripeInstance) {
            this.stripeInstance = Stripe(environment.stripe.publishableKey);
        }

        return this.stripeInstance;
    }

    initializeStripe() {
        const elementId = 'stripe-client-script';
        const script = document.getElementById(elementId);

        if (!script) {
            const node = document.createElement('script');
            node.src = 'https://js.stripe.com/v3/';
            node.type = 'text/javascript';
            node.async = false;
            node.id = elementId;
            node.charset = 'utf-8';
            node.onload = () => {
                if (!this.stripeInstance) {
                    this.stripeInstance = Stripe(environment.stripe.publishableKey);
                    this.stripeInitialized.emit(true);
                }
            };
            document.getElementsByTagName('head')[0].appendChild(node);
        } else {
            this.stripeInitialized.emit(true);
        }
    }
}
