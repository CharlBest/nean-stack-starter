import { Response } from 'express';
import { NewsletterMemberViewModel } from '../../../shared/view-models/newsletter/newsletter-member.view-model';
import { PaymentRequestViewModel } from '../../../shared/view-models/payment/payment-request.view-model';
import { BaseRepository } from '../shared/base-repository';

export class GeneralRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async createNewsletterMember(res: Response, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.general.createNewsletterMember,
            {
                email: viewModel.email
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async deleteNewsletterMember(res: Response, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.general.deleteNewsletterMember,
            {
                email: viewModel.email
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async paymentRequest(res: Response, userId: number, viewModel: PaymentRequestViewModel): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.general.paymentRequest,
            {
                userId, token: viewModel.token,
                amount: viewModel.amount
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}
