import { v1 as neo4j } from 'neo4j-driver';
import { Database } from '../../core/database';
import { BaseRepository, Folder, General } from '../shared/base-repository';
import { NewsletterMemberViewModel } from '../../../shared/view-models/newsletter/newsletter-member.view-model';
import { PaymentRequestViewModel } from '../../../shared/view-models/payment/payment-request.view-model';

export class GeneralRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async createNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        const query = require(`../../core/database/queries/${this.getQueryPath(Folder.General, General.CreateNewsletterMember)}`);
        const result = await session.run(query.data, { email: viewModel.email });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async deleteNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        const query = require(`../../core/database/queries/${this.getQueryPath(Folder.General, General.DeleteNewsletterMember)}`);
        const result = await session.run(query.data, { email: viewModel.email });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async paymentRequest(session: neo4j.Session, userId: number, viewModel: PaymentRequestViewModel): Promise<boolean> {
        const query = require(`../../core/database/queries/${this.getQueryPath(Folder.General, General.PaymentRequest)}`);
        const result = await session.run(query.data, { userId, token: viewModel.token, amount: viewModel.amount });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}
