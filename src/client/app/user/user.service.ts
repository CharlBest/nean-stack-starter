import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralRoutes } from '@shared/routes/general.routes';
import { UserRoutes } from '@shared/routes/user.routes';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { CreateReportViewModel } from '@shared/view-models/report/create-report.view-model';
import { UserPublicViewModel } from '@shared/view-models/user/user-public.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    getUserPublic(userId: number): Promise<UserPublicViewModel | null> {
        return this.http
            .get<UserPublicViewModel>(`${environment.serverEndpoint}${UserRoutes.getUserPublic(userId).client()}`).toPromise();
    }

    getUserPublicItems(userId: number, tags: string | null, pageIndex: number, pageSize?: number): Promise<ItemViewModel[] | null> {
        return this.http
            .get<ItemViewModel[]>(`${environment.serverEndpoint}${UserRoutes.getUserPublicItems(userId).client({ tags, pageIndex, pageSize })}`)
            .toPromise();
    }

    report(viewModel: CreateReportViewModel): Promise<void> {
        return this.http.post<void>(`${environment.serverEndpoint}${GeneralRoutes.report().client()}`, viewModel).toPromise();
    }
}
