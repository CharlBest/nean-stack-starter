import { UserRoutes } from '../../../shared/routes/user.routes';
import { Authentication } from '../../core/middleware/authentication';
import { BaseRoute } from '../shared/base-route';
import { usersController } from './users.controller';

class UsersRoutes extends BaseRoute {

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post(UserRoutes.createUser().server(),
            async (req, res, next) => usersController.createUser(req, res, next).catch(next));
        this.router.post(UserRoutes.doesUsernameAndEmailExist().server(),
            async (req, res, next) => usersController.doesUsernameAndEmailExist(req, res, next).catch(next));
        this.router.post(UserRoutes.forgotPassword().server(),
            async (req, res, next) => usersController.forgotPassword(req, res, next).catch(next));
        this.router.post(UserRoutes.changeForgottenPassword().server(),
            async (req, res, next) => usersController.changeForgottenPassword(req, res, next).catch(next));
        this.router.post(UserRoutes.login().server(),
            async (req, res, next) => usersController.login(req, res, next).catch(next));
        this.router.post(UserRoutes.report().server(),
            async (req, res, next) => usersController.report(req, res, next).catch(next));
        this.router.get(UserRoutes.getUserPublic().server(),
            async (req, res, next) => usersController.getUserPublic(req, res, next).catch(next));

        // Authentication - Login required
        this.router.get(UserRoutes.getUserProfile().server(), Authentication.loginRequired,
            async (req, res, next) => usersController.getUserProfile(req, res, next).catch(next));
        this.router.post(UserRoutes.verifyEmail().server(), Authentication.loginRequired,
            async (req, res, next) => usersController.verifyEmail(req, res, next).catch(next));
        this.router.put(UserRoutes.updateAvatar().server(), Authentication.loginRequired,
            async (req, res, next) => usersController.updateAvatar(req, res, next).catch(next));
        this.router.put(UserRoutes.updateBio().server(), Authentication.loginRequired,
            async (req, res, next) => usersController.updateBio(req, res, next).catch(next));
        this.router.put(UserRoutes.updatePassword().server(), Authentication.loginRequired,
            async (req, res, next) => usersController.updatePassword(req, res, next).catch(next));
        this.router.post(UserRoutes.resendEmailVerificationLink().server(), Authentication.loginRequired,
            async (req, res, next) => usersController.resendEmailVerificationLink(req, res, next).catch(next));
        this.router.delete(UserRoutes.deleteUser().server(), Authentication.loginRequired,
            async (req, res, next) => usersController.deleteUser(req, res, next).catch(next));
        this.router.post(UserRoutes.completedTutorial().server(), Authentication.loginRequired,
            async (req, res, next) => usersController.completedTutorial(req, res, next).catch(next));
        this.router.put(UserRoutes.updatePushSubscription().server(), Authentication.loginRequired,
            async (req, res, next) => usersController.updatePushSubscription(req, res, next).catch(next));
    }
}

export const usersRoutes = new UsersRoutes().router;
