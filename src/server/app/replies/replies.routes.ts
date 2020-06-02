import { ReplyRoutes } from '@shared/routes/reply.routes';
import { Authentication } from '../../core/middleware/authentication';
import { BaseRoute } from '../shared/base-route';
import { repliesController } from './replies.controller';

class RepliesRoutes extends BaseRoute {

    constructor() {
        super();
        this.initAnonymousRoutes();
        this.initAuthenticatedRoutes();
    }

    initAnonymousRoutes() {
        this.router.get(ReplyRoutes.get().server(),
            async (req, res, next) => repliesController.get(req, res, next).catch(next));

        this.router.get(ReplyRoutes.getAll().server(),
            async (req, res, next) => repliesController.getAll(req, res, next).catch(next));
    }

    initAuthenticatedRoutes() {
        this.router.post(ReplyRoutes.create().server(), Authentication.loginRequired,
            async (req, res, next) => repliesController.create(req, res, next).catch(next));

        this.router.put(ReplyRoutes.update().server(), Authentication.loginRequired,
            async (req, res, next) => repliesController.update(req, res, next).catch(next));

        this.router.delete(ReplyRoutes.delete().server(), Authentication.loginRequired,
            async (req, res, next) => repliesController.delete(req, res, next).catch(next));
    }
}

export const repliesRoutes = new RepliesRoutes().router;
