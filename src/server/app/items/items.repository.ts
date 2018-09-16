import { Response } from 'express';
import { CommentModel } from '../../../shared/models/item/comment.model';
import { ItemModel } from '../../../shared/models/item/item.model';
import { CommentViewModel } from '../../../shared/view-models/item/comment.view-model';
import { ItemUserViewModel } from '../../../shared/view-models/item/item-user.view-model';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { Database } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

export class ItemsRepository extends BaseRepository {

    constructor() {
        super();
    }

    async createItemFromDataFetcher(neo4jSession: any, app: any, userId: number, uId: string,
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
        : Promise<ItemViewModel> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.create,
            {
                userId,
                uId,
                title,
                description,
                media
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = Database.createNodeObject<ItemModel>(x.get('item'));
            viewModel.user = Database.parseValues<ItemUserViewModel>(x.get('user'));
            return viewModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async update(res: Response, userId: number, uId: string, title: string, description: string, media: Array<string>)
        : Promise<ItemViewModel> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.update,
            {
                userId,
                uId,
                title,
                description,
                media
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = Database.createNodeObject<ItemModel>(x.get('item'));
            viewModel.user = Database.parseValues<ItemUserViewModel>(x.get('user'));
            return viewModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async get(res: Response, userId: number, ip: string, uId: string): Promise<ItemViewModel> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.get,
            {
                userId,
                ip,
                uId
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = Database.createNodeObject<ItemModel>(x.get('item'));
            viewModel.user = Database.parseValues<ItemUserViewModel>(x.get('user'));
            viewModel.favourite = x.get('favourite');
            return viewModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getAll(res: Response, userId: number, pageIndex: number, pageSize: number): Promise<ItemViewModel[]> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.getAll,
            {
                userId,
                pageIndex,
                pageSize
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = Database.createNodeObject<ItemModel>(x.get('items'));
            viewModel.user = Database.parseValues<ItemUserViewModel>(x.get('users'));
            viewModel.favourite = x.get('favourite');
            return viewModel;
        });

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async delete(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.delete,
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
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.createFavourite,
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
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.deleteFavourite,
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

    async getAllFavourites(res: Response, userId: number, pageIndex: number, pageSize: number): Promise<ItemViewModel[]> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.getAllFavourites,
            {
                userId,
                pageIndex,
                pageSize
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = Database.createNodeObject<ItemModel>(x.get('items'));
            viewModel.user = Database.parseValues<ItemUserViewModel>(x.get('users'));
            viewModel.favourite = true;
            return viewModel;
        });

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async createComment(res: Response, userId: number, uId: string, itemUId: string, description: string): Promise<CommentModel> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.createComment,
            {
                userId,
                uId,
                itemUId,
                description,
            }
        );

        const model = result.records.map(x => Database.createNodeObject<CommentModel>(x.get('comment')));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async updateComment(res: Response, userId: number, uId: string, description: string): Promise<CommentModel> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.updateComment,
            {
                userId,
                uId,
                description,
            }
        );

        const model = result.records.map(x => Database.createNodeObject<CommentModel>(x.get('comment')));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async deleteComment(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.deleteComment,
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

    async getComments(res: Response, userId: number, uId: string, pageIndex: number, pageSize: number): Promise<CommentViewModel[]> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.getComments,
            {
                userId,
                uId,
                pageIndex,
                pageSize
            }
        );

        const model = result.records.map(x => {
            let viewModel = new CommentViewModel();
            viewModel = Database.createNodeObject<CommentModel>(x.get('comments'));
            viewModel.user = Database.parseValues<ItemUserViewModel>(x.get('users'));
            return viewModel;
        });

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }
}
