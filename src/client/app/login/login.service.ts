import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { UserRoutes } from '../../../server/routes/user.routes';
import { LoginViewModel } from '../../../server/view-models/create-user/login.view-model';
import { TokenViewModel } from '../../../server/view-models/create-user/token.view-model';

@Injectable()
export class LoginService {

    constructor(private http: HttpClient) { }

    public login(viewModel: LoginViewModel): Observable<TokenViewModel> {
        return this.http.post<TokenViewModel>(`${environment.apiUrlEndpoint}${UserRoutes.login.constructRootUrl()}`, viewModel);
    }
}
