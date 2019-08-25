import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StripeElementsService {

    @Output() stripeInitialized: EventEmitter<boolean> = new EventEmitter<boolean>();
    stripeInstance: stripe.Stripe;
    elementsInstance: stripe.elements.Elements;

    constructor() {
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
            node.onload = () => {
                if (!this.stripeInstance) {
                    this.stripeInstance = Stripe(environment.stripe.publishableKey);
                    this.initializeElements();
                    this.stripeInitialized.emit(true);
                }
            };
            document.getElementsByTagName('head')[0].appendChild(node);
        } else {
            this.stripeInitialized.emit(true);
        }
    }

    initializeElements() {
        this.elementsInstance = this.stripe.elements({
            locale: 'en',
            fonts: [
                {
                    src: environment.production ? `url("${environment.httpDomain}/assets/open-sans-v15-latin-regular.woff2")` : '',
                    family: 'Open Sans'
                }
            ]
        });
    }
}
