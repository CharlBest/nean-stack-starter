import { BaseRoute } from './base.route';

export class GeneralRoutes {

    private static rootRoute = 'general';

    public static createNewsletterMember = new BaseRoute(1, GeneralRoutes.rootRoute, 'createNewsletterMember');
    public static deleteNewsletterMember = new BaseRoute(1, GeneralRoutes.rootRoute, 'deleteNewsletterMember');
    public static sendFeedback = new BaseRoute(1, GeneralRoutes.rootRoute, 'sendFeedback');
    public static paymentRequest = new BaseRoute(1, GeneralRoutes.rootRoute, 'paymentRequest');
}
