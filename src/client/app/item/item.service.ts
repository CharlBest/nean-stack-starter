import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemModel } from '../../../shared/models/item/item.model';
import { ItemRoutes } from '../../../shared/routes/item.routes';
import { CreateItemViewModel } from '../../../shared/view-models/item/create-item.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ItemService {

    constructor(private http: HttpClient) { }

    public create(viewModel: CreateItemViewModel): Observable<ItemModel> {
        return this.http.post<ItemModel>(`${environment.apiUrlEndpoint}${ItemRoutes.create().client()}`, viewModel);
    }

    public update(viewModel: CreateItemViewModel): Observable<ItemModel> {
        return this.http.put<ItemModel>(`${environment.apiUrlEndpoint}${ItemRoutes.update().client()}`, viewModel);
    }

    public get(uId: string): Observable<ItemModel> {
        return this.http.get<ItemModel>(`${environment.apiUrlEndpoint}${ItemRoutes.get(uId).client()}`);
    }

    public getAll(pageIndex: number, pageSize?: number): Observable<ItemModel[]> {
        return this.http.get<ItemModel[]>(`${environment.apiUrlEndpoint}${ItemRoutes.getAll().client({ pageIndex, pageSize })}`);
    }

    public delete(uId: string): Observable<ItemModel> {
        return this.http.delete<ItemModel>(`${environment.apiUrlEndpoint}${ItemRoutes.delete(uId).client()}`);
    }
}
