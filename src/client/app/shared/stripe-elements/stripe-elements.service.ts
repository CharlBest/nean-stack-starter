import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { TranslateService } from '../translate/translate.service';

@Injectable({
    providedIn: 'root'
})
export class StripeElementsService {

    private stripeInstance: Stripe;
    elementsInstance: StripeElements;

    constructor(private translateService: TranslateService) { }

    async stripe(): Promise<Stripe> {
        if (!this.stripeInstance) {
            const stripe = await loadStripe(environment.stripe.publishableKey);
            if (stripe) {
                this.stripeInstance = stripe;
                await this.initializeElements();
            }
        }

        return this.stripeInstance;
    }

    async initializeElements() {
        this.elementsInstance = (await this.stripe()).elements({
            locale: this.translateService.defaultLanguage,
            fonts: [
                {
                    src: environment.production ? `url("${environment.serverEndpoint}/assets/fonts/OpenSans-Regular-latin.woff2")` : '',
                    family: 'Open Sans'
                }
            ]
        });
    }
}
