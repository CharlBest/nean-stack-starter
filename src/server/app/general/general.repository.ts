import { v1 as neo4j } from 'neo4j-driver';
import { NewsletterMemberViewModel } from '../../../shared/view-models/newsletter/newsletter-member.view-model';
import { PaymentRequestViewModel } from '../../../shared/view-models/payment/payment-request.view-model';
import { BaseRepository, Folder, General } from '../shared/base-repository';

export class GeneralRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async createNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        const query = await import(`../../core/database/queries/${this.getQueryPath(Folder.General, General.CreateNewsletterMember)}`);
        const result = await session.run(query.data, { email: viewModel.email });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async deleteNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        const query = await import(`../../core/database/queries/${this.getQueryPath(Folder.General, General.DeleteNewsletterMember)}`);
        const result = await session.run(query.data, { email: viewModel.email });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async paymentRequest(session: neo4j.Session, userId: number, viewModel: PaymentRequestViewModel): Promise<boolean> {
        const query = await import(`../../core/database/queries/${this.getQueryPath(Folder.General, General.PaymentRequest)}`);
        const result = await session.run(query.data, { userId, token: viewModel.token, amount: viewModel.amount });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}
