import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentModel } from '@shared/models/payment/payment.model';
import { PaymentRoutes } from '@shared/routes/payment.routes';
import { CardViewModel } from '@shared/view-models/payment/card.view-model';
import { CreateCardIntentViewModel } from '@shared/view-models/payment/create-card-intent.view-model';
import { CreatePaymentIntentViewModel } from '@shared/view-models/payment/create-payment-intent.view-model';
import { StripeIntentViewModel } from '@shared/view-models/payment/stripe-intent.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    constructor(private http: HttpClient) { }

    paymentCards(): Promise<CardViewModel[] | null> {
        return this.http.get<CardViewModel[]>(`${environment.serverEndpoint}${PaymentRoutes.paymentCards().client()}`).toPromise();
    }

    paymentIntent(viewModel: CreatePaymentIntentViewModel): Promise<StripeIntentViewModel> {
        return this.http.post<StripeIntentViewModel>(`${environment.serverEndpoint}${PaymentRoutes.paymentIntent().client()}`, viewModel)
            .toPromise();
    }

    createCardIntent(viewModel: CreateCardIntentViewModel): Promise<StripeIntentViewModel> {
        return this.http.post<StripeIntentViewModel>(`${environment.serverEndpoint}${PaymentRoutes.createCardIntent().client()}`, viewModel)
            .toPromise();
    }

    createCard(paymentMethodId: string): Promise<CardViewModel | null> {
        return this.http.post<CardViewModel>(`${environment.serverEndpoint}${PaymentRoutes.createCard().client()}`, { paymentMethodId })
            .toPromise();
    }

    deleteCard(id: string): Promise<CardViewModel | null> {
        return this.http.delete<CardViewModel>(`${environment.serverEndpoint}${PaymentRoutes.deleteCard(id).client()}`).toPromise();
    }

    updateDefaultCard(id: string): Promise<CardViewModel | null> {
        return this.http.put<CardViewModel>(`${environment.serverEndpoint}${PaymentRoutes.updateDefaultCard().client()}`, { id })
            .toPromise();
    }

    paymentHistory(): Promise<PaymentModel[] | null> {
        return this.http.get<PaymentModel[]>(`${environment.serverEndpoint}${PaymentRoutes.paymentHistory().client()}`).toPromise();
    }
}
