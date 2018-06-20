import { NextFunction, Request, Response } from 'express';
import { trimString, Validators } from '../../../shared/validation/validators';
import { FeedbackViewModel } from '../../../shared/view-models/feedback/feedback.view-model';
import { NewsletterMemberViewModel } from '../../../shared/view-models/newsletter/newsletter-member.view-model';
import { PaymentRequestViewModel } from '../../../shared/view-models/payment/payment-request.view-model';
import { Database } from '../../core/database';
import { ValidationUtil } from '../../core/utils/validation-util';
import { Emailer } from '../../email/emailer';
import { BaseController } from '../shared/base-controller';
import { GeneralService } from './general.service';

export class GeneralController extends BaseController {
    private generalService: GeneralService;

    constructor() {
        super();
        this.generalService = new GeneralService();
    }

    public async createNewsletterMember(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as NewsletterMemberViewModel;

        // Trim inputs
        viewModel.email = trimString(viewModel.email);

        const valid = Validators.required({ value: viewModel.email }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        const response = await this.generalService.createNewsletterMember(Database.getSession(req), viewModel);
        res.status(201).json(response);
    }

    public async deleteNewsletterMember(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as NewsletterMemberViewModel;

        // Trim inputs
        viewModel.email = trimString(viewModel.email);

        const valid = Validators.required({ value: viewModel.email }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        const response = await this.generalService.deleteNewsletterMember(Database.getSession(req), viewModel);
        res.status(200).json(response);
    }

    public async sendFeedback(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as FeedbackViewModel;

        const valid = Validators.required({ value: viewModel.content }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        // TODO: sending emails should happen is the service layer
        Emailer.feedbackEmail(viewModel.content);
        res.sendStatus(202);
    }

    public async paymentRequest(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as PaymentRequestViewModel;

        const valid = Validators.required({ value: viewModel.token }) ||
            Validators.required({ value: viewModel.amount }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        const response = await this.generalService.paymentRequest(Database.getSession(req), this.getUserId(req), viewModel);
        res.status(200).json(response);
    }
}
