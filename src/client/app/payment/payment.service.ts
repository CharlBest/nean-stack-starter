import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CardModel } from '../../../shared/models/payment/card.model';
import { PaymentRoutes } from '../../../shared/routes/payment.routes';
import { AnonymousPaymentViewModel } from '../../../shared/view-models/payment/anonymous-payment.view-model';
import { UserPaymentViewModel } from '../../../shared/view-models/payment/user-payment.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    constructor(private http: HttpClient) { }

    anonymousPayment(viewModel: AnonymousPaymentViewModel): Promise<boolean> {
        return this.http.post<boolean>(`${environment.httpDomain}${PaymentRoutes.anonymousPayment().client()}`, viewModel).toPromise();
    }

    paymentCards(): Promise<CardModel[] | null> {
        return this.http.get<CardModel[]>(`${environment.httpDomain}${PaymentRoutes.paymentCards().client()}`).toPromise();
    }

    userPayment(viewModel: UserPaymentViewModel): Promise<boolean> {
        return this.http.post<boolean>(`${environment.httpDomain}${PaymentRoutes.userPayment().client()}`, viewModel).toPromise();
    }
}
