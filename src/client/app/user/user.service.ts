import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { UserPublicViewModel } from '../../../shared/view-models/user/user-public.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    getUserPublic(userId: number): Promise<UserPublicViewModel | null> {
        return this.http
            .get<UserPublicViewModel>(`${environment.httpDomain}${UserRoutes.getUserPublic(userId).client()}`).toPromise();
    }

    getUserPublicItems(userId: number, pageIndex: number, pageSize?: number): Promise<ItemViewModel[] | null> {
        return this.http
            .get<ItemViewModel[]>(`${environment.httpDomain}${UserRoutes.getUserPublicItems(userId).client({ pageIndex, pageSize })}`)
            .toPromise();
    }
}
