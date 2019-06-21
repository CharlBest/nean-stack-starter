import { BaseRoute } from './base.route';

export class GeneralRoutes {

    private static root = 'general';

    static createNewsletterMember = () => new BaseRoute(GeneralRoutes.root, 'createNewsletterMember');
    static deleteNewsletterMember = (email?: string) => new BaseRoute(GeneralRoutes.root, 'deleteNewsletterMember', { email });
    static sendFeedback = () => new BaseRoute(GeneralRoutes.root, 'sendFeedback');
    static invite = () => new BaseRoute(GeneralRoutes.root, 'invite');
}
