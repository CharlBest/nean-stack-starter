import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentRoutes } from '@shared/routes/comment.routes';
import { CommentViewModel } from '@shared/view-models/comment/comment.view-model';
import { CreateOrUpdateCommentViewModel } from '@shared/view-models/comment/create-or-update-comment.view-model';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    constructor(private http: HttpClient) { }

    create(itemUId: string, viewModel: CreateOrUpdateCommentViewModel): Promise<CommentViewModel | null> {
        return this.http.post<CommentViewModel>(CommentRoutes.create(itemUId).client(), viewModel).toPromise();
    }

    update(uId: string, viewModel: CreateOrUpdateCommentViewModel): Promise<CommentViewModel | null> {
        return this.http.put<CommentViewModel>(CommentRoutes.update(uId).client(), viewModel).toPromise();
    }

    delete(uId: string): Promise<void> {
        return this.http.delete<void>(CommentRoutes.delete(uId).client()).toPromise();
    }

    get(uId: string): Promise<CommentViewModel | null> {
        return this.http.get<CommentViewModel>(CommentRoutes.get(uId).client()).toPromise();
    }

    getAll(itemUId: string, pageIndex: number, pageSize?: number): Promise<CommentViewModel[] | null> {
        return this.http.get<CommentViewModel[]>(CommentRoutes.getAll(itemUId).client({ pageIndex, pageSize })).toPromise();
    }

    getReplies(commentUId: string, pageIndex: number, pageSize?: number): Promise<CommentViewModel[] | null> {
        return this.http.get<CommentViewModel[]>(CommentRoutes.getReplies(commentUId).client({ pageIndex, pageSize })).toPromise();
    }
}
