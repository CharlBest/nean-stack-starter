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

    public anonymousPayment(viewModel: AnonymousPaymentViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${PaymentRoutes.anonymousPayment().client()}`, viewModel);
    }

    public userCards(): Observable<CardModel[]> {
        return this.http.get<CardModel[]>(`${environment.apiUrlEndpoint}${PaymentRoutes.userCards().client()}`);
    }

    public userPayment(viewModel: UserPaymentViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${PaymentRoutes.userPayment().client()}`, viewModel);
    }
}
