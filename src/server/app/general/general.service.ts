import { v1 as neo4j } from 'neo4j-driver';
import * as stripe from 'stripe';
import { NewsletterMemberViewModel } from '../../../shared/view-models/newsletter/newsletter-member.view-model';
import { PaymentRequestViewModel } from '../../../shared/view-models/payment/payment-request.view-model';
import { environment } from '../../environments/environment';
import { BaseService } from '../shared/base-service';
import { GeneralRepository } from './general.repository';

export class GeneralService extends BaseService {

    private generalRepository: GeneralRepository;

    constructor() {
        super();
        this.generalRepository = new GeneralRepository();
    }

    public async createNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        return await this.generalRepository.createNewsletterMember(session, viewModel);
    }

    public async deleteNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        return await this.generalRepository.deleteNewsletterMember(session, viewModel);
    }

    public async paymentRequest(session: neo4j.Session, userId: number, viewModel: PaymentRequestViewModel): Promise<boolean> {
        const stripeAccount = new stripe(environment.stripe.secretKey);
        // Charge the user's card:
        await stripeAccount.charges.create({
            amount: viewModel.amount * 100,
            currency: 'EUR',
            description: 'NEAN donation',
            source: viewModel.token,
        }, (err, charge) => {
            // asynchronously called
        });

        return await this.generalRepository.paymentRequest(session, userId, viewModel);
    }
}
