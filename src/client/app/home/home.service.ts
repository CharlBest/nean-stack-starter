import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemRoutes } from '@shared/routes/item.routes';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(private http: HttpClient) { }

    getAll(tags: string | null, pageIndex: number, pageSize?: number): Promise<ItemViewModel[] | null> {
        return this.http.get<ItemViewModel[]>(ItemRoutes.getAll().client({ tags, pageIndex, pageSize })).toPromise();
    }
}
