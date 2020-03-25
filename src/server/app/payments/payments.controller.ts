import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { ServerValidator, Validators } from '@shared/validation/validators';
import { AnonymousPaymentViewModel } from '@shared/view-models/payment/anonymous-payment.view-model';
import { UserPaymentViewModel } from '@shared/view-models/payment/user-payment.view-model';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../shared/base-controller';
import { paymentsService } from './payments.service';

class PaymentsController extends BaseController {

    constructor() {
        super();
    }

    async webhook(req: Request, res: Response, next: NextFunction) {
        paymentsService.webhook(res, req.body, req.headers['stripe-signature'] as string);
    }

    async anonymousPayment(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as AnonymousPaymentViewModel;

        const formGroup = FormGroupBuilder.payment(viewModel.amount);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        const emailError = !!Validators.required(viewModel.email);

        if (hasErrors || emailError) {
            throw new Error('Invalid email address');
        }

        res.status(200).json(
            await paymentsService.anonymousPayment(res, viewModel.amount, viewModel.email)
        );
    }

    async userPayment(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UserPaymentViewModel;

        const formGroup = FormGroupBuilder.payment(viewModel.amount, viewModel.cardUId, viewModel.saveCard);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await paymentsService.userPayment(res, viewModel.cardUId, viewModel.amount, viewModel.saveCard)
        );
    }

    async paymentCards(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await paymentsService.paymentCards(res)
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
            await paymentsService.deleteCard(res, uId as string)
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
