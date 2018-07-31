import { NextFunction, Request, Response } from 'express';
import { BuildFormGroup, CustomValidators, ServerValidator, trimString } from '../../../shared/validation/validators';
import { FeedbackViewModel } from '../../../shared/view-models/feedback/feedback.view-model';
import { NewsletterMemberViewModel } from '../../../shared/view-models/newsletter/newsletter-member.view-model';
import { ValidationUtil } from '../../core/utils/validation-util';
import { BaseController } from '../shared/base-controller';
import { AnonymousPaymentViewModel } from '../../../shared/view-models/payment/anonymous-payment.view-model';
import { PaymentsService } from './payments.service';
import { UserPaymentViewModel } from '../../../shared/view-models/payment/user-payment.view-model';

export class PaymentsController extends BaseController {
    private paymentsService: PaymentsService;

    constructor() {
        super();
        this.paymentsService = new PaymentsService();
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
            await this.paymentsService.anonymousPayment(res, viewModel.token, viewModel.amount)
        );
    }

    public async userPayment(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UserPaymentViewModel;

        const formGroup = BuildFormGroup.payment(viewModel.amount, viewModel.cardUId, viewModel.saveCard);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        const hasToken = ServerValidator.addGlobalError(res, 'token', CustomValidators.required(viewModel.token));
        const hasCard = ServerValidator.addGlobalError(res, 'cardUId', CustomValidators.required(viewModel.cardUId));

        if (hasErrors && (hasToken === null || hasCard === null)) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.paymentsService.userPayment(res, viewModel.cardUId, viewModel.token, viewModel.amount, viewModel.saveCard)
        );
    }

    public async userCards(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await this.paymentsService.userCards(res)
        );
    }

    public async createCard(req: Request, res: Response, next: NextFunction) {
        const token = req.body.token;

        const hasErrors = ServerValidator.addGlobalError(res, 'token', CustomValidators.required(token));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.paymentsService.createCard(res, token)
        );
    }

    public async deleteCard(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', CustomValidators.required(uId));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.paymentsService.deleteCard(res, uId)
        );
    }

    public async updateDefaultCard(req: Request, res: Response, next: NextFunction) {
        const uId = req.body.uId;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', CustomValidators.required(uId));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.paymentsService.updateDefaultCard(res, uId)
        );
    }
}
