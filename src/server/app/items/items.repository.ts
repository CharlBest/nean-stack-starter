import { Application, Response } from 'express';
import { v1 as neo4j } from 'neo4j-driver';
import { CommentViewModel } from '../../../shared/view-models/item/comment.view-model';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { Database } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

class ItemsRepository extends BaseRepository {

    constructor() {
        super();
    }

    async createItemFromDataFetcher(neo4jSession: neo4j.Session, app: Application, userId: number, uId: string,
        title: string, description: string, media: Array<string>): Promise<void> {
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
            let viewModel = new ItemViewModel();
            viewModel = record.get('item');
            viewModel.user = record.get('user');
            return viewModel;
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
            let viewModel = new ItemViewModel();
            viewModel = record.get('item');
            viewModel.user = record.get('user');
            return viewModel;
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
            let viewModel = new ItemViewModel();
            viewModel = record.get('item');
            viewModel.user = record.get('user');
            viewModel.favourite = record.get('favourite');
            viewModel.subscribed = record.get('subscribed');
            return viewModel;
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
            let viewModel = new ItemViewModel();
            viewModel = record.get('items');
            viewModel.user = record.get('users');
            viewModel.favourite = record.get('favourite');
            viewModel.subscribed = record.get('subscribed');
            return viewModel;
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
            let viewModel = new ItemViewModel();
            viewModel = record.get('items');
            viewModel.user = record.get('users');
            viewModel.favourite = true;
            return viewModel;
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
            let viewModel = new CommentViewModel();
            viewModel = record.get('comment');
            viewModel.user = record.get('user');
            viewModel.itemUId = itemUId;
            return viewModel;
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
            let viewModel = new CommentViewModel();
            viewModel = record.get('comment');
            viewModel.user = record.get('user');
            return viewModel;
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
            let viewModel = new CommentViewModel();
            viewModel = record.get('comments');
            viewModel.user = record.get('users');
            return viewModel;
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
            let viewModel = new CommentViewModel();
            viewModel = record.get('comment');
            viewModel.user = record.get('user');
            viewModel.itemUId = record.get('itemUId');
            return viewModel;
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
            let viewModel = new ItemViewModel();
            viewModel = record.get('items');
            viewModel.user = record.get('users');
            viewModel.favourite = record.get('favourite');
            viewModel.subscribed = record.get('subscribed');
            return viewModel;
        });

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }
}

export const itemsRepository = new ItemsRepository();
