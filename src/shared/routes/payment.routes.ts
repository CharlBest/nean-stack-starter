import { BaseRoute } from './base.route';

export class PaymentRoutes {

    private static rootRoute = 'payments';

    public static anonymousPayment = new BaseRoute(1, PaymentRoutes.rootRoute, 'anonymousPayment');
    public static userPayment = new BaseRoute(1, PaymentRoutes.rootRoute, 'userPayment');
    public static userCards = new BaseRoute(1, PaymentRoutes.rootRoute, 'userCards');
    public static createCard = new BaseRoute(1, PaymentRoutes.rootRoute, 'createCard');
    public static deleteCard = new BaseRoute(1, PaymentRoutes.rootRoute, 'deleteCard');
    public static updateDefaultCard = new BaseRoute(1, PaymentRoutes.rootRoute, 'updateDefaultCard');
    public static paymentHistory = new BaseRoute(1, PaymentRoutes.rootRoute, 'paymentHistory');
}
