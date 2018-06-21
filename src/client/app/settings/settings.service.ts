import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(private http: HttpClient) { }

    // public login(viewModel: LoginViewModel): Observable<TokenViewModel> {
    //     return this.http.post<TokenViewModel>(`${environment.apiUrlEndpoint}${UserRoutes.login.constructRootUrl()}`, viewModel);
    // }
}
