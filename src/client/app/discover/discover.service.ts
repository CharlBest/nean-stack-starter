import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemRoutes } from '@shared/routes/item.routes';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';

@Injectable({
    providedIn: 'root'
})
export class DiscoverService {

    constructor(private http: HttpClient) { }

    search(term: string, pageIndex: number, pageSize?: number): Promise<ItemViewModel[] | null> {
        return this.http.post<ItemViewModel[]>(ItemRoutes.search().client({ pageIndex, pageSize }), { term }).toPromise();
    }

    getAll(pageIndex: number, pageSize?: number): Promise<ItemViewModel[] | null> {
        return this.http.get<ItemViewModel[]>(ItemRoutes.getAll().client({ pageIndex, pageSize })).toPromise();
    }
}
