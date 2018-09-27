import { GeneralRoutes as GeneralStaticRoutes } from '../../../shared/routes/general.routes';
import { BaseRoute } from '../shared/base-route';
import { generalController } from './general.controller';

class GeneralRoutes extends BaseRoute {

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post(GeneralStaticRoutes.createNewsletterMember().server(),
            async (req, res, next) => generalController.createNewsletterMember(req, res, next).catch(next));
        this.router.post(GeneralStaticRoutes.deleteNewsletterMember().server(),
            async (req, res, next) => generalController.deleteNewsletterMember(req, res, next).catch(next));
        this.router.post(GeneralStaticRoutes.sendFeedback().server(),
            async (req, res, next) => generalController.sendFeedback(req, res, next).catch(next));
        this.router.post(GeneralStaticRoutes.invite().server(),
            async (req, res, next) => generalController.invite(req, res, next).catch(next));
    }
}

export const generalRoutes = new GeneralRoutes().router;
