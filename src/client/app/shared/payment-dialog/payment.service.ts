import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserCardModel } from '../../../../shared/models/user/user-card.model';
import { PaymentRoutes } from '../../../../shared/routes/payment.routes';
import { AnonymousPaymentViewModel } from '../../../../shared/view-models/payment/anonymous-payment.view-model';
import { UserPaymentViewModel } from '../../../../shared/view-models/payment/user-payment.view-model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    constructor(private http: HttpClient) { }

    public anonymousPayment(viewModel: AnonymousPaymentViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${PaymentRoutes.anonymousPayment.constructRootUrl()}`, viewModel);
    }

    public userCards(): Observable<UserCardModel[]> {
        return this.http.get<UserCardModel[]>(`${environment.apiUrlEndpoint}${PaymentRoutes.userCards.constructRootUrl()}`);
    }

    public userPayment(viewModel: UserPaymentViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${PaymentRoutes.userPayment.constructRootUrl()}`, viewModel);
    }
}
