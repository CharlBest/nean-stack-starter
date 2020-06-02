// tslint:disable: no-identical-functions
import { FileModel } from '@shared/models/shared/file.model';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { Application, Response } from 'express';
import { Session } from 'neo4j-driver';
import { Database } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';
class ItemsRepository extends BaseRepository {

    constructor() {
        super();
    }

    async createItemFromDataFetcher(neo4jSession: Session, app: Application, userId: number, uId: string,
        title: string, description: string, files: Array<FileModel> | null): Promise<void> {
        await neo4jSession.run(app.locals.dbQueries.items.create,
            {
                userId,
                uId,
                title,
                description,
                files
            }
        );
    }

    async create(res: Response, userId: number, uId: string, title: string, description: string,
        files: Array<FileModel>, tags: Array<string>): Promise<ItemViewModel | null> {
        const result = await this.run(res, Database.queries.items.create,
            {
                userId,
                uId,
                title,
                description,
                files,
                tags
            }
        );

        const model = result ? result.map(record => {
            return {
                ...record.get('item'),
                files: record.get('files'),
                tags: record.get('tags'),
                user: record.get('user'),
            } as ItemViewModel;
        }) : null;

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async update(res: Response, userId: number, uId: string, title: string, description: string,
        files: Array<FileModel>, tags: Array<string>): Promise<ItemViewModel | null> {
        const result = await this.run(res, Database.queries.items.update,
            {
                userId,
                uId,
                title,
                description,
                files,
                tags
            }
        );

        const model = result ? result.map(record => {
            return {
                ...record.get('item'),
                files: record.get('files'),
                tags: record.get('tags'),
                user: record.get('user'),
            } as ItemViewModel;
        }) : null;

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async get(res: Response, userId: number | null, ip: string, uId: string): Promise<ItemViewModel | null> {
        const result = await this.run(res, Database.queries.items.get,
            {
                userId,
                ip,
                uId
            }
        );

        const model = result ? result.map(record => {
            return {
                ...record.get('item'),
                files: record.get('files'),
                tags: record.get('tags'),
                user: record.get('user'),
                favourite: record.get('favourite'),
                subscribed: record.get('subscribed'),
            } as ItemViewModel;
        }) : null;

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getAll(res: Response, userId: number | null, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        const result = await this.run(res, Database.queries.items.getAll,
            {
                userId,
                pageIndex,
                pageSize
            }
        );

        const model = result ? result.map(record => {
            return {
                ...record.get('items'),
                files: record.get('files'),
                tags: record.get('tags'),
                user: record.get('users'),
                favourite: record.get('favourite'),
                subscribed: record.get('subscribed'),
            } as ItemViewModel;
        }) : null;

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async delete(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await this.run(res, Database.queries.items.delete,
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

    async createFavourite(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await this.run(res, Database.queries.items.createFavourite,
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

    async deleteFavourite(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await this.run(res, Database.queries.items.deleteFavourite,
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

    async getFavourites(res: Response, userId: number, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        const result = await this.run(res, Database.queries.items.getFavourites,
            {
                userId,
                pageIndex,
                pageSize
            }
        );

        const model = result ? result.map(record => {
            return {
                ...record.get('items'),
                files: record.get('files'),
                tags: record.get('tags'),
                user: record.get('users'),
                favourite: true,
            } as ItemViewModel;
        }) : null;

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async orderFavourite(res: Response, userId: number, uId: string, newOrderVal: number, originalOrderVal: number): Promise<boolean> {
        const result = await this.run(res, Database.queries.items.orderFavourite,
            {
                userId,
                uId,
                newOrderVal,
                originalOrderVal
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async search(res: Response, userId: number | null, term: string, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        const result = await this.run(res, Database.queries.items.search,
            {
                userId,
                term,
                pageIndex,
                pageSize
            }
        );

        const model = result ? result.map(record => {
            return {
                ...record.get('items'),
                files: record.get('files'),
                tags: record.get('tags'),
                user: record.get('users'),
                favourite: record.get('favourite'),
                subscribed: record.get('subscribed'),
            } as ItemViewModel;
        }) : null;

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }
}

export const itemsRepository = new ItemsRepository();
