import { UserRoutes } from '../../../shared/routes/user.routes';
import { Authentication } from '../../core/middleware/authentication';
import { BaseRoute } from '../shared/base-route';
import { UsersController } from './users.controller';

export class UsersRoutes extends BaseRoute {
    usersController: UsersController;

    constructor() {
        super();
        this.usersController = new UsersController();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post(UserRoutes.createUser.constructEndpointUrl(),
            (req, res, next) => this.usersController.createUser(req, res, next).catch(next));
        this.router.post(UserRoutes.doesUsernameAndEmailExist.constructEndpointUrl(),
            (req, res, next) => this.usersController.doesUsernameAndEmailExist(req, res, next).catch(next));
        this.router.post(UserRoutes.forgotPassword.constructEndpointUrl(),
            (req, res, next) => this.usersController.forgotPassword(req, res, next).catch(next));
        this.router.post(UserRoutes.changeForgottenPassword.constructEndpointUrl(),
            (req, res, next) => this.usersController.changeForgottenPassword(req, res, next).catch(next));
        this.router.post(UserRoutes.login.constructEndpointUrl(),
            (req, res, next) => this.usersController.login(req, res, next).catch(next));
        this.router.post(UserRoutes.report.constructEndpointUrl(),
            (req, res, next) => this.usersController.report(req, res, next).catch(next));

        // Authentication - Login required
        this.router.get(UserRoutes.getUser.constructEndpointUrl(), Authentication.loginRequired,
            (req, res, next) => this.usersController.getUser(req, res, next).catch(next));
        this.router.post(UserRoutes.verifyEmail.constructEndpointUrl(), Authentication.loginRequired,
            (req, res, next) => this.usersController.verifyEmail(req, res, next).catch(next));
        this.router.post(UserRoutes.updateAvatar.constructEndpointUrl(), Authentication.loginRequired,
            (req, res, next) => this.usersController.updateAvatar(req, res, next).catch(next));
        this.router.post(UserRoutes.updateBio.constructEndpointUrl(), Authentication.loginRequired,
            (req, res, next) => this.usersController.updateBio(req, res, next).catch(next));
        this.router.post(UserRoutes.updatePassword.constructEndpointUrl(), Authentication.loginRequired,
            (req, res, next) => this.usersController.updatePassword(req, res, next).catch(next));
        this.router.post(UserRoutes.resendEmailVerificationLink.constructEndpointUrl(), Authentication.loginRequired,
            (req, res, next) => this.usersController.resendEmailVerificationLink(req, res, next).catch(next));
        this.router.delete(UserRoutes.deleteUser.constructEndpointUrl(), Authentication.loginRequired,
            (req, res, next) => this.usersController.deleteUser(req, res, next).catch(next));
        this.router.post(UserRoutes.completedTutorial.constructEndpointUrl(), Authentication.loginRequired,
            (req, res, next) => this.usersController.completedTutorial(req, res, next).catch(next));
    }
}
