import { Response } from 'express';
import { UserCardModel } from '../../../shared/models/user/user-card.model';
import { Database, DbQueries } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

export class PaymentsRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async anonymousPayment(res: Response, paymentUId: string, chargeId: string, chargeCreated: number, token: string, amount: number): Promise<boolean> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).payments.anonymousPayment,
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

    public async userPayment(res: Response, userId: number, cardUId: string, paymentUId: string, amount: number, chargeId: string, chargeCreated: number): Promise<boolean> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).payments.userPayment,
            {
                userId,
                cardUId,
                paymentUId,
                amount,
                chargeId,
                chargeCreated,
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async userCards(res: Response, userId: number): Promise<UserCardModel[]> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).payments.userCards,
            {
                userId
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('card'))) as UserCardModel[];

        if (model !== null && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    public async createCard(res: Response, userId: number, stripeCustomerId: string, uId: string, stripeCardId: string, last4: string): Promise<UserCardModel> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).payments.createCard,
            {
                userId,
                stripeCustomerId,
                uId,
                stripeCardId,
                last4,
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('card'))) as UserCardModel[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async deleteCard(res: Response, userId: number, cardUId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).payments.deleteCard,
            {
                userId,
                cardUId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async updateDefaultCard(res: Response, userId: number, cardUId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).payments.updateDefaultCard,
            {
                userId,
                cardUId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}
