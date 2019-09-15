import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemRoutes } from '@shared/routes/item.routes';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    constructor(private http: HttpClient) { }

    search(term: string, pageIndex: number, pageSize?: number): Promise<ItemViewModel[] | null> {
        return this.http
            .post<ItemViewModel[]>(`${environment.serverEndpoint}${ItemRoutes.search().client({ pageIndex, pageSize })}`, { term })
            .toPromise();
    }
}
