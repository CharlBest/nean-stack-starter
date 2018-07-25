import { Response } from 'express';
import * as stripe from 'stripe';
import { v4 as nodeUUId } from 'uuid';
import { ServerValidator } from '../../../shared/validation/validators';
import { ValidationUtil } from '../../core/utils/validation-util';
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

    public async createNewsletterMember(res: Response, email: string): Promise<boolean> {
        email = email.toLowerCase();
        return await this.generalRepository.createNewsletterMember(res, email);
    }

    public async deleteNewsletterMember(res: Response, email: string): Promise<boolean> {
        email = email.toLowerCase();
        return await this.generalRepository.deleteNewsletterMember(res, email);
    }

    public async sendFeedback(res: Response, content: string): Promise<void> {
        Emailer.feedbackEmail(content);
    }

    public async anonymousPayment(res: Response, token: string, amount: number): Promise<boolean> {
        const stripeAccount = new stripe(environment.stripe.secretKey);
        const paymentUId = nodeUUId();

        try {
            const charge = await stripeAccount.charges.create({
                amount: amount * 100,
                currency: 'EUR',
                description: 'NEAN donation',
                source: token,
                metadata: {
                    paymentUId
                },
            });

            return await this.generalRepository.anonymousPayment(res, paymentUId, charge.id, charge.created, token, amount);
        } catch {
            ServerValidator.addGlobalError(res, 'error', true);
            throw ValidationUtil.errorResponse(res);
        }
    }
}
