import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { ServerValidator, Validators } from '@shared/validation/validators';
import { AnonymousPaymentViewModel } from '@shared/view-models/payment/anonymous-payment.view-model';
import { UserPaymentViewModel } from '@shared/view-models/payment/user-payment.view-model';
import { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';
import { stripe } from '../../core/middleware/stripe';
import { environment } from '../../environments/environment';
import { BaseController } from '../shared/base-controller';
import { paymentsService } from './payments.service';

class PaymentsController extends BaseController {

    constructor() {
        super();
    }

    async anonymousPayment(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as AnonymousPaymentViewModel;

        const formGroup = FormGroupBuilder.payment(viewModel.amount);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'anonymousPaymentToken', Validators.required(viewModel.token));
        const emailError = !!Validators.required(viewModel.email);

        if (hasErrors || emailError) {
            throw new Error('Invalid token or email');
        }

        res.status(200).json(
            await paymentsService.anonymousPayment(res, viewModel.token, viewModel.amount, viewModel.email)
        );
    }

    async userPayment(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UserPaymentViewModel;

        const formGroup = FormGroupBuilder.payment(viewModel.amount, viewModel.cardUId, viewModel.saveCard);
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
    async paymentIntent(req: Request, res: Response, next: NextFunction) {
        const { amount, currency }: { amount: number; currency: string } = req.body;
        const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
            amount,
            currency
        });

        // Send publishable key and PaymentIntent client_secret to client.
        res.send({
            clientSecret: paymentIntent.client_secret
        });
    }

    // Expose a endpoint as a webhook handler for asynchronous events.
    // Configure your webhook in the stripe developer dashboard:
    // https://dashboard.stripe.com/test/webhooks
    async stripeWebhook(req: Request, res: Response, next: NextFunction) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                (req.headers as any)['stripe-signature'],
                environment.stripe.webhookKey
            );
        } catch (err) {
            console.log(`⚠️ Webhook signature verification failed.`);
            res.sendStatus(400);
            return;
        }

        // Extract the data from the event.
        const data: Stripe.Event.Data = event.data;
        const eventType: string = event.type;

        if (eventType === 'payment_intent.succeeded') {
            // Cast the event into a PaymentIntent to make use of the types.
            const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
            // Funds have been captured
            // Fulfill any orders, e-mail receipts, etc
            // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds).
            console.log(`🔔 Webhook received: ${pi.object} ${pi.status}!`);
            console.log('💰 Payment captured!');
        } else if (eventType === 'payment_intent.payment_failed') {
            // Cast the event into a PaymentIntent to make use of the types.
            const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
            console.log(`🔔 Webhook received: ${pi.object} ${pi.status}!`);
            console.log('❌ Payment failed.');
        }
        res.sendStatus(200);
    }
}

export const paymentsController = new PaymentsController();
