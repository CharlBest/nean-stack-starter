import { BaseRoute } from './base.route';

export class GeneralRoutes {

    private static rootRoute = 'general';

    static createNewsletterMember = () => new BaseRoute(GeneralRoutes.rootRoute, 'createNewsletterMember');
    static deleteNewsletterMember = () => new BaseRoute(GeneralRoutes.rootRoute, 'deleteNewsletterMember');
    static sendFeedback = () => new BaseRoute(GeneralRoutes.rootRoute, 'sendFeedback');
    static invite = () => new BaseRoute(GeneralRoutes.rootRoute, 'invite');
}
