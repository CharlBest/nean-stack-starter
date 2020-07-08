import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { ServerValidator, Validators } from '@shared/validation/validators';
import { CreateCardIntentViewModel } from '@shared/view-models/payment/create-card-intent.view-model';
import { CreatePaymentIntentViewModel } from '@shared/view-models/payment/create-payment-intent.view-model';
import { NextFunction, Request, Response } from 'express';
import { stripe } from '../../core/middleware/stripe';
import { environment } from '../../environments/environment';
import { BaseController } from '../shared/base-controller';
import { paymentsService } from './payments.service';

class PaymentsController extends BaseController {

    constructor() {
        super();
    }

    async paymentCards(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(200).json(
            await paymentsService.paymentCards(res)
        );
    }

    async createCardIntent(req: Request, res: Response, next: NextFunction): Promise<void> {
        const viewModel = req.body as CreateCardIntentViewModel;

        res.status(200).json(
            await paymentsService.createCardIntent(res, viewModel.default || false)
        );
    }

    async createCard(req: Request, res: Response, next: NextFunction): Promise<void> {
        const paymentMethodId = req.body.paymentMethodId as string;

        const hasErrors = !!Validators.required(paymentMethodId);

        if (hasErrors) {
            throw new Error('Invalid payment method Id');
        }

        res.status(200).json(
            await paymentsService.createCard(res, paymentMethodId)
        );
    }

    async deleteCard(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id as string | null;

        const hasErrors = !!Validators.required(id);

        if (hasErrors) {
            throw new Error('Invalid card id');
        }

        res.status(200).json(
            await paymentsService.deleteCard(res, id as string)
        );
    }

    async updateDefaultCard(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.body.id as string;

        const hasErrors = !!Validators.required(id);

        if (hasErrors) {
            throw new Error('Invalid card id');
        }

        res.status(200).json(
            await paymentsService.updateDefaultCard(res, id)
        );
    }

    async paymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(200).json(
            await paymentsService.paymentHistory(res)
        );
    }

    async paymentIntent(req: Request, res: Response, next: NextFunction): Promise<void> {
        const viewModel = req.body as CreatePaymentIntentViewModel;

        const formGroup = FormGroupBuilder.payment(viewModel.amount);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        // TODO: check email or cardId

        if (hasErrors) {
            throw new Error('Invalid email or card');
        }

        res.status(200).json(
            await paymentsService.createPaymentIntent(res, viewModel.amount,
                viewModel.currency, viewModel.cardId, viewModel.saveCard, viewModel.email)
        );
    }

    // Expose a endpoint as a webhook handler for asynchronous events.
    // Configure your webhook in the stripe developer dashboard: https://dashboard.stripe.com/test/webhooks
    async stripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Retrieve the event by verifying the signature using the raw body and secret.
            const event = stripe.webhooks.constructEvent(req.body,
                (req.headers as any)['stripe-signature'], environment.stripe.webhookSigningSecret);

            // Extract the data from the event.
            await paymentsService.stripeWebhook(res, event.data, event.type);

            res.sendStatus(200);
        } catch (err) {
            // Webhook signature verification failed
            res.sendStatus(400);
        }
    }
}

export const paymentsController = new PaymentsController();
