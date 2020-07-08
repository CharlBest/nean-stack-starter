import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentModel } from '@shared/models/payment/payment.model';
import { PaymentRoutes } from '@shared/routes/payment.routes';
import { CardViewModel } from '@shared/view-models/payment/card.view-model';
import { CreateCardIntentViewModel } from '@shared/view-models/payment/create-card-intent.view-model';
import { CreatePaymentIntentViewModel } from '@shared/view-models/payment/create-payment-intent.view-model';
import { StripeIntentViewModel } from '@shared/view-models/payment/stripe-intent.view-model';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    constructor(private http: HttpClient) { }

    paymentCards(): Promise<CardViewModel[] | null> {
        return this.http.get<CardViewModel[]>(PaymentRoutes.paymentCards().client()).toPromise();
    }

    paymentIntent(viewModel: CreatePaymentIntentViewModel): Promise<StripeIntentViewModel> {
        return this.http.post<StripeIntentViewModel>(PaymentRoutes.paymentIntent().client(), viewModel).toPromise();
    }

    createCardIntent(viewModel: CreateCardIntentViewModel): Promise<StripeIntentViewModel> {
        return this.http.post<StripeIntentViewModel>(PaymentRoutes.createCardIntent().client(), viewModel).toPromise();
    }

    createCard(paymentMethodId: string): Promise<CardViewModel | null> {
        return this.http.post<CardViewModel>(PaymentRoutes.createCard().client(), { paymentMethodId }).toPromise();
    }

    deleteCard(id: string): Promise<CardViewModel | null> {
        return this.http.delete<CardViewModel>(PaymentRoutes.deleteCard(id).client()).toPromise();
    }

    updateDefaultCard(id: string): Promise<CardViewModel | null> {
        return this.http.put<CardViewModel>(PaymentRoutes.updateDefaultCard().client(), { id }).toPromise();
    }

    paymentHistory(): Promise<PaymentModel[] | null> {
        return this.http.get<PaymentModel[]>(PaymentRoutes.paymentHistory().client()).toPromise();
    }
}
