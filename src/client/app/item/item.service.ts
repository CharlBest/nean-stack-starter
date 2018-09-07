import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemRoutes } from '../../../shared/routes/item.routes';
import { CreateOrEditItemViewModel } from '../../../shared/view-models/item/create-item.view-model';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { ReportItemViewModel } from '../../../shared/view-models/item/report-item.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ItemService {

    constructor(private http: HttpClient) { }

    public create(viewModel: CreateOrEditItemViewModel): Observable<ItemViewModel> {
        return this.http.post<ItemViewModel>(`${environment.apiUrlEndpoint}${ItemRoutes.create().client()}`, viewModel);
    }

    public update(uId: string, viewModel: CreateOrEditItemViewModel): Observable<ItemViewModel> {
        return this.http.put<ItemViewModel>(`${environment.apiUrlEndpoint}${ItemRoutes.update(uId).client()}`, viewModel);
    }

    public get(uId: string): Observable<ItemViewModel> {
        return this.http.get<ItemViewModel>(`${environment.apiUrlEndpoint}${ItemRoutes.get(uId).client()}`);
    }

    public delete(uId: string): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.apiUrlEndpoint}${ItemRoutes.delete(uId).client()}`);
    }

    public sendReport(viewModel: ReportItemViewModel): Observable<void> {
        return this.http.post<void>(`${environment.apiUrlEndpoint}${ItemRoutes.report().client()}`, viewModel);
    }
}
