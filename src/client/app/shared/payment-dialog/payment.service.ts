import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GeneralRoutes } from '../../../../server/routes/general.routes';
import { UserModel } from '../../../../server/models/user/user.model';
import { PaymentRequestViewModel } from '../../../../server/view-models/payment/payment-request.view-model';

@Injectable()
export class PaymentService {

    constructor(private http: HttpClient) { }

    public processPaymentRequest(viewModel: PaymentRequestViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${GeneralRoutes.paymentRequest.constructRootUrl()}`, viewModel);
    }
}
