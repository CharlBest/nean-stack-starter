import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemRoutes } from '@shared/routes/item.routes';
import { NotificationRoutes } from '@shared/routes/notification.routes';
import { CreateOrUpdateItemViewModel } from '@shared/view-models/item/create-or-update-item.view-model';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { OrderFavouriteViewModel } from '@shared/view-models/item/order-favourite.view-model';
import { ReportItemViewModel } from '@shared/view-models/item/report-item.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ItemService {

    constructor(private http: HttpClient) { }

    create(viewModel: CreateOrUpdateItemViewModel): Promise<ItemViewModel | null> {
        return this.http.post<ItemViewModel>(`${environment.serverEndpoint}${ItemRoutes.create().client()}`, viewModel).toPromise();
    }

    update(uId: string, viewModel: CreateOrUpdateItemViewModel): Promise<ItemViewModel | null> {
        return this.http.put<ItemViewModel>(`${environment.serverEndpoint}${ItemRoutes.update(uId).client()}`, viewModel).toPromise();
    }

    get(uId: string): Promise<ItemViewModel | null> {
        return this.http.get<ItemViewModel>(`${environment.serverEndpoint}${ItemRoutes.get(uId).client()}`).toPromise();
    }

    delete(uId: string): Promise<boolean> {
        return this.http.delete<boolean>(`${environment.serverEndpoint}${ItemRoutes.delete(uId).client()}`).toPromise();
    }

    sendReport(viewModel: ReportItemViewModel): Promise<void> {
        return this.http.post<void>(`${environment.serverEndpoint}${ItemRoutes.report().client()}`, viewModel).toPromise();
    }

    createFavourite(uId: string): Promise<void> {
        return this.http.post<void>(`${environment.serverEndpoint}${ItemRoutes.createFavourite(uId).client()}`, null).toPromise();
    }

    deleteFavourite(uId: string): Promise<void> {
        return this.http.delete<void>(`${environment.serverEndpoint}${ItemRoutes.deleteFavourite(uId).client()}`).toPromise();
    }

    getFavourites(pageIndex: number, pageSize?: number): Promise<ItemViewModel[] | null> {
        return this.http
            .get<ItemViewModel[]>(`${environment.serverEndpoint}${ItemRoutes.getFavourites().client({ pageIndex, pageSize })}`).toPromise();
    }

    orderFavourite(uId: string, viewModel: OrderFavouriteViewModel): Promise<void> {
        return this.http.put<void>(`${environment.serverEndpoint}${ItemRoutes.orderFavourite(uId).client()}`, viewModel).toPromise();
    }

    createSubscription(uId: string): Promise<void> {
        return this.http
            .post<void>(`${environment.serverEndpoint}${NotificationRoutes.createSubscription(uId).client()}`, null).toPromise();
    }

    deleteSubscription(uId: string): Promise<void> {
        return this.http.delete<void>(`${environment.serverEndpoint}${NotificationRoutes.deleteSubscription(uId).client()}`).toPromise();
    }
}
