import { CommentViewModel } from '@shared/view-models/item/comment.view-model';
import { Response } from 'express';
import { Record } from 'neo4j-driver';
import { Database } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

class CommentsRepository extends BaseRepository {

    constructor() {
        super();
    }

    async create(res: Response, userId: number, uId: string, itemUId: string, description: string, commentUId?: string | null)
        : Promise<CommentViewModel | null> {
        const result = await this.run(res, Database.queries.comments.create,
            {
                userId,
                uId,
                itemUId,
                description,
                commentUId,
            }
        );

        const model = result ? result.map(record => this.buildCommentViewModel(record)) : null;

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async update(res: Response, userId: number, uId: string, description: string): Promise<CommentViewModel | null> {
        const result = await this.run(res, Database.queries.comments.update,
            {
                userId,
                uId,
                description,
            }
        );

        const model = result ? result.map(record => this.buildCommentViewModel(record)) : null;

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async delete(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await this.run(res, Database.queries.comments.delete,
            {
                userId,
                uId
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async get(res: Response, userId: number | null, ip: string, uId: string): Promise<CommentViewModel | null> {
        const result = await this.run(res, Database.queries.comments.get,
            {
                userId,
                ip,
                uId
            }
        );

        const model = result ? result.map(record => this.buildCommentViewModel(record)) : null;

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getAll(res: Response, userId: number | null, uId: string, pageIndex: number, pageSize: number)
        : Promise<CommentViewModel[] | null> {
        const result = await this.run(res, Database.queries.comments.getAll,
            {
                userId,
                uId,
                pageIndex,
                pageSize
            }
        );

        const model = result ? result.map(record => this.buildCommentViewModel(record)) : null;

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async getReplies(res: Response, userId: number | null, uId: string, pageIndex: number, pageSize: number)
        : Promise<CommentViewModel[] | null> {
        const result = await this.run(res, Database.queries.comments.getReplies,
            {
                userId,
                uId,
                pageIndex,
                pageSize
            }
        );

        const model = result ? result.map(record => this.buildCommentViewModel(record)) : null;

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    private buildCommentViewModel(record: Record): CommentViewModel {
        return {
            ...(record.has('comments') ? record.get('comments') : record.get('comment')) as CommentViewModel,
            user: record.has('users') ? record.get('users') : record.get('user'),
            isItemOwner: record.get('isItemOwner'),
            itemUId: record.get('itemUId'),
        };
    }
}

export const commentsRepository = new CommentsRepository();
