import { Response } from 'express';
import { BaseRepository } from '../shared/base-repository';

class GeneralRepository extends BaseRepository {

    constructor() {
        super();
    }

    async createNewsletterMember(res: Response, email: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.general.createNewsletterMember,
            {
                email
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    async deleteNewsletterMember(res: Response, email: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.general.deleteNewsletterMember,
            {
                email
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}

export const generalRepository = new GeneralRepository();
