import { Response } from 'express';
import { BaseRepository } from '../shared/base-repository';

export class GeneralRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async createNewsletterMember(res: Response, email: string): Promise<boolean> {
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

    public async deleteNewsletterMember(res: Response, email: string): Promise<boolean> {
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

    public async paymentRequest(res: Response, userId: number, token: string, amount: number): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.general.paymentRequest,
            {
                userId,
                token,
                amount
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}
