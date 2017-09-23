import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { UserRoutes } from '../../../server/routes/user.routes';

@Injectable()
export class SettingsService {

    constructor(private http: HttpClient) { }

    // public login(viewModel: LoginViewModel): Observable<TokenViewModel> {
    //     return this.http.post<TokenViewModel>(`${environment.apiUrlEndpoint}${UserRoutes.login.constructRootUrl()}`, viewModel);
    // }
}
