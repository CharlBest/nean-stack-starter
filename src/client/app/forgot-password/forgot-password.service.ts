import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { ChangeForgottenPasswordViewModel } from '../../../shared/view-models/forgot-password/change-forgotten-password.view-model';
import { ForgotPasswordViewModel } from '../../../shared/view-models/forgot-password/forgot-password.view-model';

@Injectable()
export class ForgotPasswordService {

    constructor(private http: HttpClient) { }

    public forgotPassword(viewModel: ForgotPasswordViewModel): Observable<void> {
        return this.http.post<void>(`${environment.apiUrlEndpoint}${UserRoutes.forgotPassword.constructRootUrl()}`, viewModel);
    }

    public changeForgottenPassword(viewModel: ChangeForgottenPasswordViewModel): Observable<void> {
        return this.http.post<void>(`${environment.apiUrlEndpoint}${UserRoutes.changeForgottenPassword.constructRootUrl()}`, viewModel);
    }
}
