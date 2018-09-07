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

    public async createInternal(neo4jSession: any, dbQuery: string, userId: number, uId: string, title: string, description: string): Promise<void> {
        await neo4jSession.run(dbQuery,
            {
                userId,
                uId,
                title,
                description
            }
        );
    }

    public async create(res: Response, userId: number, uId: string, title: string, description: string): Promise<ItemViewModel> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.create,
            {
                userId,
                uId,
                title,
                description
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = Database.createNodeObject(x.get('item')) as ItemModel;
            viewModel.user = Database.parseValues(x.get('user')) as ItemUserViewModel;
            return viewModel;
        }) as ItemViewModel[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async update(res: Response, userId: number, uId: string, title: string, description: string): Promise<any> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.update,
            {
                userId,
                uId,
                title,
                description
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = Database.createNodeObject(x.get('item')) as ItemModel;
            viewModel.user = Database.parseValues(x.get('user')) as ItemUserViewModel;
            return viewModel;
        }) as ItemViewModel[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async get(res: Response, userId: number, ip: string, uId: string): Promise<ItemViewModel> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.get,
            {
                userId,
                ip,
                uId
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = Database.createNodeObject(x.get('item')) as ItemModel;
            viewModel.user = Database.parseValues(x.get('user')) as ItemUserViewModel;
            return viewModel;
        }) as ItemViewModel[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async getAll(res: Response, userId: number, pageIndex: number, pageSize: number): Promise<ItemViewModel[]> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.getAll,
            {
                userId,
                pageIndex,
                pageSize
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = Database.createNodeObject(x.get('items')) as ItemModel;
            viewModel.user = Database.parseValues(x.get('users')) as ItemUserViewModel;
            return viewModel;
        }) as ItemViewModel[];

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    public async delete(res: Response, userId: number, uId: string): Promise<boolean> {
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
