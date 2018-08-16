import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { UserPublicViewModel } from '../../../shared/view-models/user/user-public.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    public getUserPublic(userId: number): Observable<UserPublicViewModel> {
        return this.http.get<UserPublicViewModel>(`${environment.apiUrlEndpoint}${UserRoutes.getUserPublic(userId).client()}`);
    }
}
