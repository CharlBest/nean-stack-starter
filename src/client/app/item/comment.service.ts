import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentRoutes } from '@shared/routes/comment.routes';
import { CommentViewModel } from '@shared/view-models/comment/comment.view-model';
import { CreateOrUpdateCommentViewModel } from '@shared/view-models/comment/create-or-update-comment.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    constructor(private http: HttpClient) { }

    create(itemUId: string, viewModel: CreateOrUpdateCommentViewModel): Promise<CommentViewModel | null> {
        return this.http
            .post<CommentViewModel>(`${environment.serverEndpoint}${CommentRoutes.create(itemUId).client()}`, viewModel).toPromise();
    }

    update(uId: string, viewModel: CreateOrUpdateCommentViewModel): Promise<CommentViewModel | null> {
        return this.http
            .put<CommentViewModel>(`${environment.serverEndpoint}${CommentRoutes.update(uId).client()}`, viewModel).toPromise();
    }

    delete(uId: string): Promise<void> {
        return this.http.delete<void>(`${environment.serverEndpoint}${CommentRoutes.delete(uId).client()}`).toPromise();
    }

    get(uId: string): Promise<CommentViewModel | null> {
        return this.http.get<CommentViewModel>(`${environment.serverEndpoint}${CommentRoutes.get(uId).client()}`).toPromise();
    }

    getAll(itemUId: string, pageIndex: number, pageSize?: number): Promise<CommentViewModel[] | null> {
        return this.http
            .get<CommentViewModel[]>(`${environment.serverEndpoint}${CommentRoutes.getAll(itemUId).client({ pageIndex, pageSize })}`)
            .toPromise();
    }

    getReplies(commentUId: string, pageIndex: number, pageSize?: number): Promise<CommentViewModel[] | null> {
        return this.http
            .get<CommentViewModel[]>(`${environment.serverEndpoint}${CommentRoutes.getReplies(commentUId).client({ pageIndex, pageSize })}`)
            .toPromise();
    }
}
