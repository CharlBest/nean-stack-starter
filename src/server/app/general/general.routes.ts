import { GeneralRoutes as GeneralStaticRoutes } from '@shared/routes/general.routes';
import { BaseRoute } from '../shared/base-route';
import { generalController } from './general.controller';

class GeneralRoutes extends BaseRoute {

    constructor() {
        super();
        this.initAnonymousRoutes();
        this.initAuthenticatedRoutes();
    }

    initAnonymousRoutes(): void {
        this.router.post(GeneralStaticRoutes.createNewsletterMember().server(),
            async (req, res, next) => generalController.createNewsletterMember(req, res, next).catch(next));

        this.router.delete(GeneralStaticRoutes.deleteNewsletterMember().server(),
            async (req, res, next) => generalController.deleteNewsletterMember(req, res, next).catch(next));

        this.router.post(GeneralStaticRoutes.sendFeedback().server(),
            async (req, res, next) => generalController.sendFeedback(req, res, next).catch(next));

        this.router.post(GeneralStaticRoutes.invite().server(),
            async (req, res, next) => generalController.invite(req, res, next).catch(next));

        this.router.post(GeneralStaticRoutes.report().server(),
            async (req, res, next) => generalController.report(req, res, next).catch(next));
    }

    initAuthenticatedRoutes(): void { }
}

export const generalRoutes = new GeneralRoutes().router;
