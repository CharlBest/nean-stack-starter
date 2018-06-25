import { v1 as neo4j } from 'neo4j-driver';
import { NewsletterMemberViewModel } from '../../../shared/view-models/newsletter/newsletter-member.view-model';
import { PaymentRequestViewModel } from '../../../shared/view-models/payment/payment-request.view-model';
import { BaseRepository } from '../shared/base-repository';

export class GeneralRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async createNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        const result = await session.run(this.query.general.createNewsletterMember, { email: viewModel.email });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async deleteNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        const result = await session.run(this.query.general.deleteNewsletterMember, { email: viewModel.email });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async paymentRequest(session: neo4j.Session, userId: number, viewModel: PaymentRequestViewModel): Promise<boolean> {
        const result = await session.run(this.query.general.paymentRequest, { userId, token: viewModel.token, amount: viewModel.amount });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}
