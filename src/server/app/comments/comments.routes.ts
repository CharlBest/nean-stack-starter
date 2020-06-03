import { CommentRoutes } from '@shared/routes/comment.routes';
import { Authentication } from '../../core/middleware/authentication';
import { BaseRoute } from '../shared/base-route';
import { commentsController } from './comments.controller';

class CommentsRoutes extends BaseRoute {

    constructor() {
        super();
        this.initAnonymousRoutes();
        this.initAuthenticatedRoutes();
    }

    initAnonymousRoutes() {
        this.router.get(CommentRoutes.get().server(),
            async (req, res, next) => commentsController.get(req, res, next).catch(next));

        this.router.get(CommentRoutes.getAll().server(),
            async (req, res, next) => commentsController.getAll(req, res, next).catch(next));

        this.router.get(CommentRoutes.getReplies().server(),
            async (req, res, next) => commentsController.getReplies(req, res, next).catch(next));
    }

    initAuthenticatedRoutes() {
        this.router.post(CommentRoutes.create().server(), Authentication.loginRequired,
            async (req, res, next) => commentsController.create(req, res, next).catch(next));

        this.router.put(CommentRoutes.update().server(), Authentication.loginRequired,
            async (req, res, next) => commentsController.update(req, res, next).catch(next));

        this.router.delete(CommentRoutes.delete().server(), Authentication.loginRequired,
            async (req, res, next) => commentsController.delete(req, res, next).catch(next));
    }
}

export const commentsRoutes = new CommentsRoutes().router;
