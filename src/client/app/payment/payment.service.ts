import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

    anonymousPayment(viewModel: AnonymousPaymentViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.httpDomain}${PaymentRoutes.anonymousPayment().client()}`, viewModel);
    }

    userCards(): Observable<CardModel[] | null> {
        return this.http.get<CardModel[]>(`${environment.httpDomain}${PaymentRoutes.userCards().client()}`);
    }

    userPayment(viewModel: UserPaymentViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.httpDomain}${PaymentRoutes.userPayment().client()}`, viewModel);
    }
}
