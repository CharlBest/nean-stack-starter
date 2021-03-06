import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRoutes } from '@shared/routes/user.routes';
import { ChangeForgottenPasswordViewModel } from '@shared/view-models/forgot-password/change-forgotten-password.view-model';
import { ForgotPasswordViewModel } from '@shared/view-models/forgot-password/forgot-password.view-model';

@Injectable({
    providedIn: 'root'
})
export class ForgotPasswordService {

    constructor(private http: HttpClient) { }

    forgotPassword(viewModel: ForgotPasswordViewModel): Promise<void> {
        return this.http.post<void>(UserRoutes.forgotPassword().client(), viewModel).toPromise();
    }

    changeForgottenPassword(viewModel: ChangeForgottenPasswordViewModel): Promise<void> {
        return this.http.post<void>(UserRoutes.changeForgottenPassword().client(), viewModel).toPromise();
    }
}
