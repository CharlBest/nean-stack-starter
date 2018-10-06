import { NextFunction, Request, Response } from 'express';
import { BuildFormGroup, ServerValidator, Validators } from '../../../shared/validation/validators';
import { AnonymousPaymentViewModel } from '../../../shared/view-models/payment/anonymous-payment.view-model';
import { UserPaymentViewModel } from '../../../shared/view-models/payment/user-payment.view-model';
import { BaseController } from '../shared/base-controller';
import { paymentsService } from './payments.service';

class PaymentsController extends BaseController {

    constructor() {
        super();
    }

    async anonymousPayment(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as AnonymousPaymentViewModel;

        const formGroup = BuildFormGroup.payment(viewModel.amount);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'anonymousPaymentToken', Validators.required(viewModel.token));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await paymentsService.anonymousPayment(res, viewModel.token, viewModel.amount, viewModel.email)
        );
    }

    async userPayment(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UserPaymentViewModel;

        const formGroup = BuildFormGroup.payment(viewModel.amount, viewModel.cardUId, viewModel.saveCard);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        const hasToken = ServerValidator.addGlobalError(res, 'userPaymentToken', Validators.required(viewModel.token));
        const hasCard = !!Validators.required(viewModel.cardUId);

        if (hasErrors || (!hasToken && !hasCard)) {
            throw new Error('Invalid token or card');
        }

        res.status(200).json(
            await paymentsService.userPayment(res, viewModel.cardUId, viewModel.token, viewModel.amount, viewModel.saveCard)
        );
    }

    async userCards(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await paymentsService.userCards(res)
        );
    }

    async createCard(req: Request, res: Response, next: NextFunction) {
        const token = req.body.token as string;

        const hasErrors = !!Validators.required(token);

        if (hasErrors) {
            throw new Error('Invalid card token');
        }

        res.status(200).json(
            await paymentsService.createCard(res, token)
        );
    }

    async deleteCard(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('Invalid card uId');
        }

        res.status(200).json(
            await paymentsService.deleteCard(res, uId!)
        );
    }

    async updateDefaultCard(req: Request, res: Response, next: NextFunction) {
        const uId = req.body.uId as string;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('Invalid card uId');
        }

        res.status(200).json(
            await paymentsService.updateDefaultCard(res, uId)
        );
    }

    async paymentHistory(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await paymentsService.paymentHistory(res)
        );
    }
}

export const paymentsController = new PaymentsController();
