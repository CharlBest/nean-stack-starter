import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../../../shared/models/user/user.model';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { CreateUserViewModel } from '../../../shared/view-models/create-user/create-user.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CreateUserService {

    constructor(private http: HttpClient) { }

    public createUser(viewModel: CreateUserViewModel): Observable<UserModel> {
        return this.http.post<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.createUser.constructRootUrl()}`, viewModel);
    }
}
