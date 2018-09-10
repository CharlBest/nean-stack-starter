import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { LoginViewModel } from '../../../shared/view-models/create-user/login.view-model';
import { TokenViewModel } from '../../../shared/view-models/create-user/token.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient) { }

    login(viewModel: LoginViewModel): Observable<TokenViewModel> {
        return this.http.post<TokenViewModel>(`${environment.apiUrlEndpoint}${UserRoutes.login().client()}`, viewModel);
    }
}
