import { BaseRoute } from './base.route';

export class PaymentRoutes {

    private static root = 'payments';

    static webhook = () => new BaseRoute(PaymentRoutes.root, 'webhook');
    static anonymousPayment = () => new BaseRoute(PaymentRoutes.root, 'anonymousPayment');
    static userPayment = () => new BaseRoute(PaymentRoutes.root, 'userPayment');
    static paymentCards = () => new BaseRoute(PaymentRoutes.root, 'paymentCards');
    static createCard = () => new BaseRoute(PaymentRoutes.root, 'createCard');
    static deleteCard = (uId?: string) => new BaseRoute(PaymentRoutes.root, 'deleteCard', { uId });
    static updateDefaultCard = () => new BaseRoute(PaymentRoutes.root, 'updateDefaultCard');
    static paymentHistory = () => new BaseRoute(PaymentRoutes.root, 'paymentHistory');
}
