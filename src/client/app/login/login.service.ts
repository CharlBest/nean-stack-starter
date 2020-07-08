import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRoutes } from '@shared/routes/user.routes';
import { LoginViewModel } from '@shared/view-models/create-user/login.view-model';
import { TokenViewModel } from '@shared/view-models/create-user/token.view-model';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient) { }

    login(viewModel: LoginViewModel): Promise<TokenViewModel | null> {
        return this.http.post<TokenViewModel>(UserRoutes.login().client(), viewModel).toPromise();
    }
}
