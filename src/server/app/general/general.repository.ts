import { Response } from 'express';
import { DbQueries } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

export class GeneralRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async createNewsletterMember(res: Response, email: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).general.createNewsletterMember,
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
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).general.deleteNewsletterMember,
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

    public async anonymousPayment(res: Response, paymentUId: string, chargeId: string, chargeCreated: number, token: string, amount: number): Promise<boolean> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).general.anonymousPayment,
            {
                paymentUId,
                chargeId,
                chargeCreated,
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
