import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralRoutes } from '../../../../shared/routes/general.routes';
import { PaymentRequestViewModel } from '../../../../shared/view-models/payment/payment-request.view-model';
import { environment } from '../../../environments/environment';

@Injectable()
export class PaymentService {

    constructor(private http: HttpClient) { }

    public processPaymentRequest(viewModel: PaymentRequestViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${GeneralRoutes.paymentRequest.constructRootUrl()}`, viewModel);
    }
}
