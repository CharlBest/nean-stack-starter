import { v1 as neo4j } from 'neo4j-driver';
import { v4 as nodeUUId } from 'node-uuid';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { sign } from 'jsonwebtoken';
import { GeneralRepository } from './general.repository';
import { BaseService } from '../shared/base-service';
import { NewsletterMemberViewModel } from '../../view-models/newsletter/newsletter-member.view-model';
import { TokenViewModel } from '../../view-models/create-user/token.view-model';
import { environment } from '../../environments/environment';
import { UserModel } from '../../models/user/user.model';
import { ValidationUtil } from '../../core/utils/validation-util';
import { DoesUsernameAndEmailExist } from '../../view-models/create-user/does-username-and-email-exist.view-model';
import { TutorialType } from '../../view-models/tutorial/tutorial-type.enum';
import { CompletedTutorial } from '../../view-models/tutorial/completed-tutorial.view-model';
import { PaymentRequestViewModel } from '../../view-models/payment/payment-request.view-model';
const stripe = require('stripe')(environment.stripe.secretKey);

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
        // Charge the user's card:
        stripe.charges.create({
            amount: viewModel.amount * 100,
            currency: 'EUR',
            description: 'Example charge',
            source: viewModel.token,
        }, (err, charge) => {
            // asynchronously called
        });

        return await this.generalRepository.paymentRequest(session, userId, viewModel);
    }
}
