import { BaseRoute } from './base.route';

export class GeneralRoutes {

    private static rootRoute = 'general';

    public static createNewsletterMember = () => new BaseRoute(GeneralRoutes.rootRoute, 'createNewsletterMember');
    public static deleteNewsletterMember = () => new BaseRoute(GeneralRoutes.rootRoute, 'deleteNewsletterMember');
    public static sendFeedback = () => new BaseRoute(GeneralRoutes.rootRoute, 'sendFeedback');
}
