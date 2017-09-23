import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from '../shared/base-route';
import { UsersController } from './users.controller';
import { UserRoutes } from '../../routes/user.routes';

export class UsersRoutes extends BaseRoute {
    usersController: UsersController;

    constructor() {
        super();
        this.usersController = new UsersController();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post(UserRoutes.createUser.constructEndpointUrl(), (req, res, next) => this.usersController.createUser(req, res, next));
        this.router.post(UserRoutes.doesUsernameAndEmailExist.constructEndpointUrl(), (req, res, next) => this.usersController.doesUsernameAndEmailExist(req, res, next));
        this.router.post(UserRoutes.forgotPassword.constructEndpointUrl(), (req, res, next) => this.usersController.forgotPassword(req, res, next));
        this.router.post(UserRoutes.changeForgottenPassword.constructEndpointUrl(), (req, res, next) => this.usersController.changeForgottenPassword(req, res, next));
        this.router.post(UserRoutes.login.constructEndpointUrl(), (req, res, next) => this.usersController.login(req, res, next));
        this.router.get(UserRoutes.getUser.constructEndpointUrl(), (req, res, next) => this.usersController.getUser(req, res, next));
        this.router.get(UserRoutes.report.constructEndpointUrl(), (req, res, next) => this.usersController.report(req, res, next));
        this.router.post(UserRoutes.createNewsletterMember.constructEndpointUrl(), (req, res, next) => this.usersController.createNewsletterMember(req, res, next));
        this.router.post(UserRoutes.deleteNewsletterMember.constructEndpointUrl(), (req, res, next) => this.usersController.deleteNewsletterMember(req, res, next));
        this.router.post(UserRoutes.verifyEmail.constructEndpointUrl(), (req, res, next) => this.usersController.verifyEmail(req, res, next));
    }
}
