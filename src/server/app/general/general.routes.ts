import { GeneralRoutes as GeneralStaticRoutes } from '../../../shared/routes/general.routes';
import { BaseRoute } from '../shared/base-route';
import { GeneralController } from './general.controller';

export class GeneralRoutes extends BaseRoute {
    generalController: GeneralController;

    constructor() {
        super();
        this.generalController = new GeneralController();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post(GeneralStaticRoutes.createNewsletterMember().server(),
            async (req, res, next) => this.generalController.createNewsletterMember(req, res, next).catch(next));
        this.router.post(GeneralStaticRoutes.deleteNewsletterMember().server(),
            async (req, res, next) => this.generalController.deleteNewsletterMember(req, res, next).catch(next));
        this.router.post(GeneralStaticRoutes.sendFeedback().server(),
            async (req, res, next) => this.generalController.sendFeedback(req, res, next).catch(next));
        this.router.post(GeneralStaticRoutes.invite().server(),
            async (req, res, next) => this.generalController.invite(req, res, next).catch(next));
    }
}
