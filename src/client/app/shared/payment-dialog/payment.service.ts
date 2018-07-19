import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralRoutes } from '../../../../shared/routes/general.routes';
import { PaymentRequestViewModel } from '../../../../shared/view-models/payment/payment-request.view-model';
import { environment } from '../../../environments/environment';

declare var Stripe: any;

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

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
        var script = document.getElementById(elementId);

        if (script === undefined || script === null) {
            let node = document.createElement('script');
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

    public processPaymentRequest(viewModel: PaymentRequestViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${GeneralRoutes.paymentRequest.constructRootUrl()}`, viewModel);
    }
}
