import { Response } from 'express';
import { CardModel } from '../../../shared/models/payment/card.model';
import { PaymentModel } from '../../../shared/models/payment/payment.model';
import { Database } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

export class PaymentsRepository extends BaseRepository {

    constructor() {
        super();
    }

    async anonymousPayment(res: Response, paymentUId: string, chargeId: string, chargeCreated: number, amount: number, email: string)
        : Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.payments.anonymousPayment,
            {
                paymentUId,
                chargeId,
                chargeCreated,
                amount,
                email
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    async userPayment(res: Response, userId: number, cardUId: string | null, paymentUId: string,
        amount: number, chargeId: string, chargeCreated: number): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.payments.userPayment,
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

    async userCards(res: Response, userId: number): Promise<CardModel[] | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.payments.userCards,
            {
                userId
            }
        );

        const model = result.records.map(x => Database.createNodeObject<CardModel>(x.get('card')));

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async createCard(res: Response, userId: number, stripeCustomerId: string, uId: string, stripeCardId: string,
        stripeFingerprint: string, brand: string, last4: string, expireMonth: number, expireYear: number): Promise<CardModel | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.payments.createCard,
            {
                userId,
                stripeCustomerId,
                uId,
                stripeCardId,
                stripeFingerprint,
                brand,
                last4,
                expireMonth,
                expireYear,
            }
        );

        const model = result.records.map(x => Database.createNodeObject<CardModel>(x.get('card')));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async deleteCard(res: Response, userId: number, cardUId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.payments.deleteCard,
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

    async updateDefaultCard(res: Response, userId: number, cardUId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.payments.updateDefaultCard,
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

    async paymentHistory(res: Response, userId: number): Promise<PaymentModel[] | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.payments.paymentHistory,
            {
                userId
            }
        );

        const model = result.records.map(x => Database.createNodeObject<PaymentModel>(x.get('payments')));

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }
}
