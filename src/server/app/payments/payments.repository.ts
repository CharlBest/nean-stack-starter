import { PaymentModel } from '@shared/models/payment/payment.model';
import { Response } from 'express';
import { Database } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

class PaymentsRepository extends BaseRepository {

    constructor() {
        super();
    }

    async anonymousPayment(res: Response, chargeId: string, amount: number, chargeCreated: number, email: string)
        : Promise<boolean> {
        const result = await this.run(res, Database.queries.payments.anonymousPayment,
            {
                chargeId,
                amount,
                chargeCreated,
                email
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async userPayment(res: Response, userId: number, chargeId: string, amount: number, chargeCreated: number): Promise<boolean> {
        const result = await this.run(res, Database.queries.payments.userPayment,
            {
                userId,
                chargeId,
                amount,
                chargeCreated,
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async paymentHistory(res: Response, userId: number): Promise<PaymentModel[] | null> {
        const result = await this.run(res, Database.queries.payments.paymentHistory,
            {
                userId
            }
        );

        const model = result ? result.map(record => record.get('payments')) : null;

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async updateCustomer(res: Response, userId: number, stripeCustomerId: string): Promise<boolean> {
        const result = await this.run(res, Database.queries.payments.updateCustomer,
            {
                userId,
                stripeCustomerId
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }
}

export const paymentsRepository = new PaymentsRepository();
