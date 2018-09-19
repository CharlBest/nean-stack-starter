import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemRoutes } from '../../../shared/routes/item.routes';
import { CommentViewModel } from '../../../shared/view-models/item/comment.view-model';
import { CreateOrUpdateCommentViewModel } from '../../../shared/view-models/item/create-or-update-comment.view-model';
import { CreateOrUpdateItemViewModel } from '../../../shared/view-models/item/create-or-update-item.view-model';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { ReportItemViewModel } from '../../../shared/view-models/item/report-item.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ItemService {

    constructor(private http: HttpClient) { }

    create(viewModel: CreateOrUpdateItemViewModel): Observable<ItemViewModel> {
        return this.http.post<ItemViewModel>(`${environment.apiUrlEndpoint}${ItemRoutes.create().client()}`, viewModel);
    }

    update(uId: string, viewModel: CreateOrUpdateItemViewModel): Observable<ItemViewModel> {
        return this.http.put<ItemViewModel>(`${environment.apiUrlEndpoint}${ItemRoutes.update(uId).client()}`, viewModel);
    }

    get(uId: string): Observable<ItemViewModel> {
        return this.http.get<ItemViewModel>(`${environment.apiUrlEndpoint}${ItemRoutes.get(uId).client()}`);
    }

    delete(uId: string): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.apiUrlEndpoint}${ItemRoutes.delete(uId).client()}`);
    }

    sendReport(viewModel: ReportItemViewModel): Observable<void> {
        return this.http.post<void>(`${environment.apiUrlEndpoint}${ItemRoutes.report().client()}`, viewModel);
    }

    createFavourite(uId: string): Observable<void> {
        return this.http.post<void>(`${environment.apiUrlEndpoint}${ItemRoutes.createFavourite(uId).client()}`, null);
    }

    deleteFavourite(uId: string): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrlEndpoint}${ItemRoutes.deleteFavourite(uId).client()}`);
    }

    getAllFavourites(pageIndex: number, pageSize?: number): Observable<ItemViewModel[]> {
        return this.http
            .get<ItemViewModel[]>(`${environment.apiUrlEndpoint}${ItemRoutes.getAllFavourites().client({ pageIndex, pageSize })}`);
    }

    createComment(viewModel: CreateOrUpdateCommentViewModel): Observable<CommentViewModel> {
        return this.http.post<CommentViewModel>(`${environment.apiUrlEndpoint}${ItemRoutes.createComment().client()}`, viewModel);
    }

    updateComment(uId: string, viewModel: CreateOrUpdateCommentViewModel): Observable<CommentViewModel> {
        return this.http.put<CommentViewModel>(`${environment.apiUrlEndpoint}${ItemRoutes.updateComment(uId).client()}`, viewModel);
    }

    deleteComment(uId: string): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrlEndpoint}${ItemRoutes.deleteComment(uId).client()}`);
    }

    getComments(itemUId: string, pageIndex: number, pageSize?: number): Observable<CommentViewModel[]> {
        return this.http
            .get<CommentViewModel[]>(`${environment.apiUrlEndpoint}${ItemRoutes.getComments(itemUId).client({ pageIndex, pageSize })}`);
    }

    getComment(uId: string): Observable<CommentViewModel> {
        return this.http.get<CommentViewModel>(`${environment.apiUrlEndpoint}${ItemRoutes.getComment(uId).client()}`);
    }
}
