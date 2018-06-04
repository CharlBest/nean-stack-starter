import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { ChangeForgottenPasswordViewModel } from '../../../shared/view-models/forgot-password/change-forgotten-password.view-model';
import { ForgotPasswordViewModel } from '../../../shared/view-models/forgot-password/forgot-password.view-model';
import { environment } from '../../environments/environment';

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
