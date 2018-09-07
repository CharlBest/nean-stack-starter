import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemRoutes } from '../../../shared/routes/item.routes';
import { CreateItemViewModel } from '../../../shared/view-models/item/create-item.view-model';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CreateItemService {

    constructor(private http: HttpClient) { }

    public create(viewModel: CreateItemViewModel): Observable<ItemViewModel> {
        return this.http.post<ItemViewModel>(`${environment.apiUrlEndpoint}${ItemRoutes.create().client()}`, viewModel);
    }

    public update(uId: string, viewModel: CreateItemViewModel): Observable<ItemViewModel> {
        return this.http.put<ItemViewModel>(`${environment.apiUrlEndpoint}${ItemRoutes.update(uId).client()}`, viewModel);
    }

    public get(uId: string): Observable<ItemViewModel> {
        return this.http.get<ItemViewModel>(`${environment.apiUrlEndpoint}${ItemRoutes.get(uId).client()}`);
    }
}
