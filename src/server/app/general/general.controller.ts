import { NextFunction, Request, Response } from 'express';
import { BuildFormGroup, CustomValidators, ServerValidator, trimString } from '../../../shared/validation/validators';
import { FeedbackViewModel } from '../../../shared/view-models/feedback/feedback.view-model';
import { NewsletterMemberViewModel } from '../../../shared/view-models/newsletter/newsletter-member.view-model';
import { ValidationUtil } from '../../core/utils/validation-util';
import { BaseController } from '../shared/base-controller';
import { GeneralService } from './general.service';
import { AnonymousPaymentViewModel } from '../../../shared/view-models/payment/anonymous-payment.view-model';

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

        const formGroup = BuildFormGroup.newsletter(viewModel.email);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(201).json(
            await this.generalService.createNewsletterMember(res, viewModel.email)
        );
    }

    public async deleteNewsletterMember(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as NewsletterMemberViewModel;

        // Trim inputs
        viewModel.email = trimString(viewModel.email);

        const formGroup = BuildFormGroup.newsletter(viewModel.email);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.generalService.deleteNewsletterMember(res, viewModel.email)
        );
    }

    public async sendFeedback(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as FeedbackViewModel;

        const formGroup = BuildFormGroup.feedback(viewModel.content);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        await this.generalService.sendFeedback(res, viewModel.content);

        res.status(200).json();
    }

    public async anonymousPayment(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as AnonymousPaymentViewModel;

        const formGroup = BuildFormGroup.payment(viewModel.amount);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'token', CustomValidators.required(viewModel.token));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.generalService.anonymousPayment(res, viewModel.token, viewModel.amount)
        );
    }
}
