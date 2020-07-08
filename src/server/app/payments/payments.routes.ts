import { PaymentRoutes } from '@shared/routes/payment.routes';
import * as express from 'express';
import { Authentication } from '../../core/middleware/authentication';
import { BaseRoute } from '../shared/base-route';
import { paymentsController } from './payments.controller';

class PaymentsRoutes extends BaseRoute {

    constructor() {
        super();
        this.initAnonymousRoutes();
        this.initAuthenticatedRoutes();
    }

    initAnonymousRoutes(): void {
        this.router.post(PaymentRoutes.stripeWebhook().server(), express.raw({ type: 'application/json' }),
            async (req, res, next) => paymentsController.stripeWebhook(req, res, next).catch(next));

        this.router.post(PaymentRoutes.paymentIntent().server(),
            async (req, res, next) => paymentsController.paymentIntent(req, res, next).catch(next));
    }

    initAuthenticatedRoutes(): void {
        this.router.get(PaymentRoutes.paymentCards().server(), Authentication.loginRequired,
            async (req, res, next) => paymentsController.paymentCards(req, res, next).catch(next));

        this.router.post(PaymentRoutes.createCardIntent().server(), Authentication.loginRequired,
            async (req, res, next) => paymentsController.createCardIntent(req, res, next).catch(next));

        this.router.post(PaymentRoutes.createCard().server(), Authentication.loginRequired,
            async (req, res, next) => paymentsController.createCard(req, res, next).catch(next));

        this.router.delete(PaymentRoutes.deleteCard().server(), Authentication.loginRequired,
            async (req, res, next) => paymentsController.deleteCard(req, res, next).catch(next));

        this.router.put(PaymentRoutes.updateDefaultCard().server(), Authentication.loginRequired,
            async (req, res, next) => paymentsController.updateDefaultCard(req, res, next).catch(next));

        this.router.get(PaymentRoutes.paymentHistory().server(), Authentication.loginRequired,
            async (req, res, next) => paymentsController.paymentHistory(req, res, next).catch(next));
    }
}

export const paymentsRoutes = new PaymentsRoutes().router;
