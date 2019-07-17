import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { CreateUserViewModel } from '@shared/view-models/create-user/create-user.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CreateUserService {

    constructor(private http: HttpClient) { }

    createUser(viewModel: CreateUserViewModel): Promise<void> {
        return this.http.post<void>(`${environment.httpDomain}${UserRoutes.createUser().client()}`, viewModel).toPromise();
    }
}
