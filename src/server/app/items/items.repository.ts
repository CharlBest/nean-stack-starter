import { Response } from 'express';
import { ItemModel } from '../../../shared/models/item/item.model';
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
}



declare global {
    namespace Express {
        interface Response {
            locals?: {
                test: string;
            };
        }
    }
}
