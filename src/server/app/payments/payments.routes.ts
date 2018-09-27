import { PaymentRoutes } from '../../../shared/routes/payment.routes';
import { Authentication } from '../../core/middleware/authentication';
import { BaseRoute } from '../shared/base-route';
import { paymentsController } from './payments.controller';

class PaymentsRoutes extends BaseRoute {

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post(PaymentRoutes.anonymousPayment().server(),
            async (req, res, next) => paymentsController.anonymousPayment(req, res, next).catch(next));

        this.router.post(PaymentRoutes.userPayment().server(), Authentication.loginRequired,
            async (req, res, next) => paymentsController.userPayment(req, res, next).catch(next));
        this.router.get(PaymentRoutes.userCards().server(), Authentication.loginRequired,
            async (req, res, next) => paymentsController.userCards(req, res, next).catch(next));
        this.router.post(PaymentRoutes.createCard().server(), Authentication.loginRequired,
            async (req, res, next) => paymentsController.createCard(req, res, next).catch(next));
        this.router.delete(PaymentRoutes.deleteCard().server(), Authentication.loginRequired,
            async (req, res, next) => paymentsController.deleteCard(req, res, next).catch(next));
        this.router.post(PaymentRoutes.updateDefaultCard().server(), Authentication.loginRequired,
            async (req, res, next) => paymentsController.updateDefaultCard(req, res, next).catch(next));
        this.router.get(PaymentRoutes.paymentHistory().server(), Authentication.loginRequired,
            async (req, res, next) => paymentsController.paymentHistory(req, res, next).catch(next));
    }
}

export const paymentsRoutes = new PaymentsRoutes().router;
