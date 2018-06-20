import { NextFunction, Request, Response } from 'express';
import { v4 as nodeUUId } from 'uuid';
import * as webSocket from 'ws';
import { trimString, Validators } from '../../../shared/validation/validators';
import { CreateUserViewModel } from '../../../shared/view-models/create-user/create-user.view-model';
import { LoginViewModel } from '../../../shared/view-models/create-user/login.view-model';
import { ChangeForgottenPasswordViewModel } from '../../../shared/view-models/forgot-password/change-forgotten-password.view-model';
import { ForgotPasswordViewModel } from '../../../shared/view-models/forgot-password/forgot-password.view-model';
import { UpdateAvatarViewModel } from '../../../shared/view-models/profile/update-avatar.view-model';
import { UpdateBioViewModel } from '../../../shared/view-models/profile/update-bio.view-model';
import { UpdatePasswordViewModel } from '../../../shared/view-models/profile/update-password.view-model';
import { CompletedTutorial } from '../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { Database } from '../../core/database';
import { WebSocketServer } from '../../core/middleware/web-socket-server';
import { ValidationUtil } from '../../core/utils/validation-util';
import { Emailer } from '../../email/emailer';
import { BaseController } from '../shared/base-controller';
import { UsersService } from './users.service';

export class UsersController extends BaseController {
    private usersService: UsersService;

    constructor() {
        super();
        this.usersService = new UsersService();
    }

    public async createUser(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as CreateUserViewModel;

        // Trim inputs
        viewModel.username = trimString(viewModel.username);
        viewModel.email = trimString(viewModel.email);

        const valid = Validators.required({ value: viewModel.username }) ||
            Validators.required({ value: viewModel.email }) ||
            Validators.required({ value: viewModel.password }) ||
            Validators.minLength(6)({ value: viewModel.password }) ||
            Validators.email({ value: viewModel.email }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        const response = await this.usersService.createUser(Database.getSession(req), viewModel.email, viewModel.username, viewModel.password);
        Emailer.welcomeEmail(response.email, response.username, response.emailCode);

        // Notify everyone there is another sign up
        const wss = WebSocketServer.getSocketServer();
        wss.clients.forEach(client => {
            if (client.readyState === webSocket.OPEN) {
                client.send('New sign up just now');
            }
        });

        res.status(201).json(response);
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as LoginViewModel;

        // Trim inputs
        viewModel.emailOrUsername = trimString(viewModel.emailOrUsername);

        const valid = Validators.required({ value: viewModel.emailOrUsername }) ||
            Validators.required({ value: viewModel.password }) ||
            Validators.minLength(6)({ value: viewModel.password }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        const response = await this.usersService.login(Database.getSession(req), viewModel.emailOrUsername, viewModel.password);
        res.status(200).json(response);
    }

    public async getUser(req: Request, res: Response, next: NextFunction) {
        const response = await this.usersService.getUserById(Database.getSession(req), this.getUserId(req));
        res.status(200).json(response);
    }

    public async report(req: Request, res: Response, next: NextFunction) {
        // TODO: do something
        res.sendStatus(200);
    }

    // TODO: not in use
    public async doesUsernameAndEmailExist(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as CreateUserViewModel;

        const response = await this.usersService.doesUsernameAndEmailExist(Database.getSession(req), viewModel.email, viewModel.username);
        res.status(200).json(response);
    }

    public async forgotPassword(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as ForgotPasswordViewModel;

        // Trim inputs
        viewModel.email = trimString(viewModel.email);

        const valid = Validators.required({ value: viewModel.email }) ||
            Validators.email({ value: viewModel.email }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        const code = nodeUUId();

        const response = await this.usersService.forgotPassword(Database.getSession(req), viewModel.email, code);
        Emailer.forgotPasswordEmail(response.email, code);

        res.status(200).json(response);
    }

    public async changeForgottenPassword(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as ChangeForgottenPasswordViewModel;

        // Trim inputs
        viewModel.email = trimString(viewModel.email);

        const valid = Validators.required({ value: viewModel.email }) ||
            Validators.email({ value: viewModel.email }) ||
            Validators.required({ value: viewModel.code }) ||
            Validators.required({ value: viewModel.password }) ||
            Validators.minLength(6)({ value: viewModel.password }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        const response = await this.usersService.changeForgottenPassword(Database.getSession(req), viewModel.email, viewModel.code, viewModel.password);
        res.status(200).json(response);
    }

    public async verifyEmail(req: Request, res: Response, next: NextFunction) {
        const code = req.body.code;
        const valid = Validators.required({ value: code }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        const response = await this.usersService.verifyEmail(Database.getSession(req), this.getUserId(req), code);
        res.status(200).json(response);
    }

    public async updateAvatar(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UpdateAvatarViewModel;

        const response = await this.usersService.updateAvatar(Database.getSession(req), this.getUserId(req), viewModel.avatarUrl);
        res.status(200).json(response);
    }

    public async updateBio(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UpdateBioViewModel;

        const response = await this.usersService.updateBio(Database.getSession(req), this.getUserId(req), viewModel.content);
        res.status(200).json(response);
    }

    public async updatePassword(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UpdatePasswordViewModel;

        const valid = Validators.required({ value: viewModel.password }) ||
            Validators.required({ value: viewModel.newPassword }) ||
            Validators.minLength(6)({ value: viewModel.newPassword }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        const response = await this.usersService.updatePassword(Database.getSession(req), this.getUserId(req), viewModel.password, viewModel.newPassword);
        res.status(200).json(response);
    }

    public async resendEmailVerificationLink(req: Request, res: Response, next: NextFunction) {
        const response = await this.usersService.getUserById(Database.getSession(req), this.getUserId(req));
        Emailer.resendEmailVerificationLinkEmail(response.email, response.emailCode);

        res.status(200).json(response);
    }

    public async deleteUser(req: Request, res: Response, next: NextFunction) {
        const response = await this.usersService.deleteUser(Database.getSession(req), this.getUserId(req));
        res.status(200).json(response);
    }

    public async completedTutorial(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as CompletedTutorial;
        const valid = Validators.required({ value: viewModel.tutorialType }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        const response = await this.usersService.completedTutorial(Database.getSession(req), this.getUserId(req), viewModel);
        res.status(200).json(response);
    }
}
