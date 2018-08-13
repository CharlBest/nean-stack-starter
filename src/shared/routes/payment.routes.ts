import { BaseRoute } from './base.route';

export class PaymentRoutes {

    private static rootRoute = 'payments';

    public static anonymousPayment = () => new BaseRoute(PaymentRoutes.rootRoute, 'anonymousPayment');
    public static userPayment = () => new BaseRoute(PaymentRoutes.rootRoute, 'userPayment');
    public static userCards = () => new BaseRoute(PaymentRoutes.rootRoute, 'userCards');
    public static createCard = () => new BaseRoute(PaymentRoutes.rootRoute, 'createCard');
    public static deleteCard = (uId?: string) => new BaseRoute(PaymentRoutes.rootRoute, 'deleteCard', { uId });
    public static updateDefaultCard = () => new BaseRoute(PaymentRoutes.rootRoute, 'updateDefaultCard');
    public static paymentHistory = () => new BaseRoute(PaymentRoutes.rootRoute, 'paymentHistory');
}
