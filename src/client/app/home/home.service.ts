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

    getAll(pageIndex: number, pageSize?: number): Observable<ItemViewModel[]> {
        return this.http.get<ItemViewModel[]>(`${environment.apiUrlEndpoint}${ItemRoutes.getAll().client({ pageIndex, pageSize })}`);
    }
}
