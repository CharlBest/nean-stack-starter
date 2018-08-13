import { Response } from 'express';
import { Database, DbQueries } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

export class ItemsRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async create(res: Response, userId: number): Promise<any> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).items.create,
            {
                userId
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as any[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async update(res: Response, userId: number): Promise<any> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).items.update,
            {
                userId
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as any[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async get(res: Response, userId: number): Promise<any> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).items.get,
            {
                userId
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as any[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async getAll(res: Response, userId: number): Promise<any> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).items.getAll,
            {
                userId
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as any[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async delete(res: Response, userId: number): Promise<any> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).items.delete,
            {
                userId
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as any[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }
}
