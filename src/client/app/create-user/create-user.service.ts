import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRoutes } from '@shared/routes/user.routes';
import { CreateUserViewModel } from '@shared/view-models/create-user/create-user.view-model';

@Injectable({
    providedIn: 'root'
})
export class CreateUserService {

    constructor(private http: HttpClient) { }

    createUser(viewModel: CreateUserViewModel): Promise<void> {
        return this.http.post<void>(UserRoutes.createUser().client(), viewModel).toPromise();
    }
}
