import { PaymentRoutes } from '../../../shared/routes/payment.routes';
import { Authentication } from '../../core/middleware/authentication';
import { BaseRoute } from '../shared/base-route';
import { PaymentsController } from './payments.controller';

export class PaymentsRoutes extends BaseRoute {
    paymentsController: PaymentsController;

    constructor() {
        super();
        this.paymentsController = new PaymentsController();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post(PaymentRoutes.anonymousPayment.constructEndpointUrl(),
            (req, res, next) => this.paymentsController.anonymousPayment(req, res, next).catch(next));

        this.router.post(PaymentRoutes.userPayment.constructEndpointUrl(), Authentication.loginRequired,
            (req, res, next) => this.paymentsController.userPayment(req, res, next).catch(next));
        this.router.get(PaymentRoutes.userCards.constructEndpointUrl(), Authentication.loginRequired,
            (req, res, next) => this.paymentsController.userCards(req, res, next).catch(next));
        this.router.post(PaymentRoutes.createCard.constructEndpointUrl(), Authentication.loginRequired,
            (req, res, next) => this.paymentsController.createCard(req, res, next).catch(next));
        this.router.delete(PaymentRoutes.deleteCard.constructEndpointUrl('/:uId'), Authentication.loginRequired,
            (req, res, next) => this.paymentsController.deleteCard(req, res, next).catch(next));
        this.router.post(PaymentRoutes.updateDefaultCard.constructEndpointUrl(), Authentication.loginRequired,
            (req, res, next) => this.paymentsController.updateDefaultCard(req, res, next).catch(next));
    }
}
