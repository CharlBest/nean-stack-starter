import { BaseRoute } from './base.route';

export class PaymentRoutes {

    private static rootRoute = 'payments';

    static anonymousPayment = () => new BaseRoute(PaymentRoutes.rootRoute, 'anonymousPayment');
    static userPayment = () => new BaseRoute(PaymentRoutes.rootRoute, 'userPayment');
    static userCards = () => new BaseRoute(PaymentRoutes.rootRoute, 'userCards');
    static createCard = () => new BaseRoute(PaymentRoutes.rootRoute, 'createCard');
    static deleteCard = (uId?: string) => new BaseRoute(PaymentRoutes.rootRoute, 'deleteCard', { uId });
    static updateDefaultCard = () => new BaseRoute(PaymentRoutes.rootRoute, 'updateDefaultCard');
    static paymentHistory = () => new BaseRoute(PaymentRoutes.rootRoute, 'paymentHistory');
}
