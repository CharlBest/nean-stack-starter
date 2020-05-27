import { BaseRoute } from './base.route';

export class PaymentRoutes {

    private static root = 'payments';

    static stripeWebhook = () => new BaseRoute(PaymentRoutes.root, 'stripeWebook');
    static paymentIntent = () => new BaseRoute(PaymentRoutes.root, 'paymentIntent');
    static paymentCards = () => new BaseRoute(PaymentRoutes.root, 'paymentCards');
    static createCardIntent = () => new BaseRoute(PaymentRoutes.root, 'createCardIntent');
    static createCard = () => new BaseRoute(PaymentRoutes.root, 'createCard');
    static deleteCard = (id?: string) => new BaseRoute(PaymentRoutes.root, 'deleteCard', { id });
    static updateDefaultCard = () => new BaseRoute(PaymentRoutes.root, 'updateDefaultCard');
    static paymentHistory = () => new BaseRoute(PaymentRoutes.root, 'paymentHistory');
}
