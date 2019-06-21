import { BaseRoute } from './base.route';

export class PaymentRoutes {

    private static root = 'payments';

    static anonymousPayment = () => new BaseRoute(PaymentRoutes.root, 'anonymousPayment');
    static userPayment = () => new BaseRoute(PaymentRoutes.root, 'userPayment');
    static userCards = () => new BaseRoute(PaymentRoutes.root, 'userCards');
    static createCard = () => new BaseRoute(PaymentRoutes.root, 'createCard');
    static deleteCard = (uId?: string) => new BaseRoute(PaymentRoutes.root, 'deleteCard', { uId });
    static updateDefaultCard = () => new BaseRoute(PaymentRoutes.root, 'updateDefaultCard');
    static paymentHistory = () => new BaseRoute(PaymentRoutes.root, 'paymentHistory');
}
