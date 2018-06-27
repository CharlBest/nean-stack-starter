import { Response } from 'express';
import * as stripe from 'stripe';
import { FeedbackViewModel } from '../../../shared/view-models/feedback/feedback.view-model';
import { NewsletterMemberViewModel } from '../../../shared/view-models/newsletter/newsletter-member.view-model';
import { PaymentRequestViewModel } from '../../../shared/view-models/payment/payment-request.view-model';
import { Emailer } from '../../email/emailer';
import { environment } from '../../environments/environment';
import { BaseService } from '../shared/base-service';
import { GeneralRepository } from './general.repository';

export class GeneralService extends BaseService {

    private generalRepository: GeneralRepository;

    constructor() {
        super();
        this.generalRepository = new GeneralRepository();
    }

    public async createNewsletterMember(res: Response, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        return await this.generalRepository.createNewsletterMember(res, viewModel);
    }

    public async deleteNewsletterMember(res: Response, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        return await this.generalRepository.deleteNewsletterMember(res, viewModel);
    }

    public async sendFeedback(res: Response, viewModel: FeedbackViewModel): Promise<void> {
        Emailer.feedbackEmail(viewModel.content);
    }

    public async paymentRequest(res: Response, viewModel: PaymentRequestViewModel): Promise<boolean> {
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

        return await this.generalRepository.paymentRequest(res, this.getUserId(res), viewModel);
    }
}
