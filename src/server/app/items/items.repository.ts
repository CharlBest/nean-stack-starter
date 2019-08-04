// tslint:disable: no-identical-functions
import { CommentViewModel } from '@shared/view-models/item/comment.view-model';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { Application, Response } from 'express';
import { v1 as neo4j } from 'neo4j-driver';
import { Database } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';
class ItemsRepository extends BaseRepository {

    constructor() {
        super();
    }

    async createItemFromDataFetcher(neo4jSession: neo4j.Session, app: Application, userId: number, uId: string,
        title: string, description: string, media: Array<string> | null): Promise<void> {
        await neo4jSession.run(app.locals.dbQueries.items.create,
            {
                userId,
                uId,
                title,
                description,
                media
            }
        );
    }

    async create(res: Response, userId: number, uId: string, title: string, description: string, media: Array<string>)
        : Promise<ItemViewModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.create,
            {
                userId,
                uId,
                title,
                description,
                media
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('item'),
                user: record.get('user')
            } as ItemViewModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async update(res: Response, userId: number, uId: string, title: string, description: string, media: Array<string>)
        : Promise<ItemViewModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.update,
            {
                userId,
                uId,
                title,
                description,
                media
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('item'),
                user: record.get('user')
            } as ItemViewModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async get(res: Response, userId: number | null, ip: string, uId: string): Promise<ItemViewModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.get,
            {
                userId,
                ip,
                uId
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('item'),
                user: record.get('user'),
                favourite: record.get('favourite'),
                subscribed: record.get('subscribed'),
            } as ItemViewModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getItems(res: Response, userId: number | null, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.getItems,
            {
                userId,
                pageIndex,
                pageSize
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('items'),
                user: record.get('users'),
                favourite: record.get('favourite'),
                subscribed: record.get('subscribed'),
            } as ItemViewModel;
        });

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async delete(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.delete,
            {
                userId,
                uId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    async createFavourite(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.createFavourite,
            {
                userId,
                uId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    async deleteFavourite(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.deleteFavourite,
            {
                userId,
                uId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    async getFavourites(res: Response, userId: number, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.getFavourites,
            {
                userId,
                pageIndex,
                pageSize
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('items'),
                user: record.get('users'),
                favourite: true,
            } as ItemViewModel;
        });

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async createComment(res: Response, userId: number, uId: string, itemUId: string, description: string)
        : Promise<CommentViewModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.createComment,
            {
                userId,
                uId,
                itemUId,
                description,
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('comment'),
                user: record.get('user'),
                itemUId,
            } as CommentViewModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async updateComment(res: Response, userId: number, uId: string, description: string): Promise<CommentViewModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.updateComment,
            {
                userId,
                uId,
                description,
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('comment'),
                user: record.get('user'),
            } as CommentViewModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async deleteComment(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.deleteComment,
            {
                userId,
                uId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    async getComments(res: Response, userId: number | null, uId: string, pageIndex: number, pageSize: number)
        : Promise<CommentViewModel[] | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.getComments,
            {
                userId,
                uId,
                pageIndex,
                pageSize
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('comments'),
                user: record.get('users'),
            } as CommentViewModel;
        });

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async getComment(res: Response, userId: number | null, ip: string, uId: string): Promise<CommentViewModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.getComment,
            {
                userId,
                ip,
                uId
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('comment'),
                user: record.get('user'),
                itemUId: record.get('itemUId'),
            } as CommentViewModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async search(res: Response, userId: number | null, term: string, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.items.search,
            {
                userId,
                term,
                pageIndex,
                pageSize
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('items'),
                user: record.get('users'),
                favourite: record.get('favourite'),
                subscribed: record.get('subscribed'),
            } as ItemViewModel;
        });

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }
}

export const itemsRepository = new ItemsRepository();
