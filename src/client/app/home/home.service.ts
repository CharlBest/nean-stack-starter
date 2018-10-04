import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemRoutes } from '../../../shared/routes/item.routes';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(private http: HttpClient) { }

    getItems(pageIndex: number, pageSize?: number): Observable<ItemViewModel[] | null> {
        return this.http.get<ItemViewModel[]>(`${environment.apiUrlEndpoint}${ItemRoutes.getItems().client({ pageIndex, pageSize })}`);
    }
}
