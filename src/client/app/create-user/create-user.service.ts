import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { CreateUserViewModel } from '../../../shared/view-models/create-user/create-user.view-model';
import { UserModel } from '../../../shared/models/user/user.model';

@Injectable()
export class CreateUserService {

    constructor(private http: HttpClient) { }

    public createUser(viewModel: CreateUserViewModel): Observable<UserModel> {
        return this.http.post<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.createUser.constructRootUrl()}`, viewModel);
    }
}
