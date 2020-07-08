import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralRoutes } from '@shared/routes/general.routes';
import { ItemRoutes } from '@shared/routes/item.routes';
import { NotificationRoutes } from '@shared/routes/notification.routes';
import { CreateOrUpdateItemViewModel } from '@shared/view-models/item/create-or-update-item.view-model';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { OrderFavouriteViewModel } from '@shared/view-models/item/order-favourite.view-model';
import { CreateReportViewModel } from '@shared/view-models/report/create-report.view-model';

@Injectable({
    providedIn: 'root'
})
export class ItemService {

    constructor(private http: HttpClient) { }

    create(viewModel: CreateOrUpdateItemViewModel): Promise<ItemViewModel | null> {
        return this.http.post<ItemViewModel>(ItemRoutes.create().client(), viewModel).toPromise();
    }

    update(uId: string, viewModel: CreateOrUpdateItemViewModel): Promise<ItemViewModel | null> {
        return this.http.put<ItemViewModel>(ItemRoutes.update(uId).client(), viewModel).toPromise();
    }

    get(uId: string): Promise<ItemViewModel | null> {
        return this.http.get<ItemViewModel>(ItemRoutes.get(uId).client()).toPromise();
    }

    delete(uId: string): Promise<boolean> {
        return this.http.delete<boolean>(ItemRoutes.delete(uId).client()).toPromise();
    }

    report(viewModel: CreateReportViewModel): Promise<void> {
        return this.http.post<void>(GeneralRoutes.report().client(), viewModel).toPromise();
    }

    createFavourite(uId: string): Promise<void> {
        return this.http.post<void>(ItemRoutes.createFavourite(uId).client(), null).toPromise();
    }

    deleteFavourite(uId: string): Promise<void> {
        return this.http.delete<void>(ItemRoutes.deleteFavourite(uId).client()).toPromise();
    }

    getFavourites(tags: string | null, pageIndex: number, pageSize?: number): Promise<ItemViewModel[] | null> {
        return this.http.get<ItemViewModel[]>(ItemRoutes.getFavourites().client({ tags, pageIndex, pageSize })).toPromise();
    }

    getSubscriptions(tags: string | null, pageIndex: number, pageSize?: number): Promise<ItemViewModel[] | null> {
        return this.http.get<ItemViewModel[]>(NotificationRoutes.getSubscriptions().client({ tags, pageIndex, pageSize })).toPromise();
    }

    orderFavourite(uId: string, viewModel: OrderFavouriteViewModel): Promise<void> {
        return this.http.put<void>(ItemRoutes.orderFavourite(uId).client(), viewModel).toPromise();
    }

    createSubscription(uId: string): Promise<void> {
        return this.http.post<void>(NotificationRoutes.createSubscription(uId).client(), null).toPromise();
    }

    deleteSubscription(uId: string): Promise<void> {
        return this.http.delete<void>(NotificationRoutes.deleteSubscription(uId).client()).toPromise();
    }
}
