import { NextFunction, Request, Response, Router } from 'express';
import { v4 as nodeUUId } from 'node-uuid';
import { UsersService } from './users.service';
import { Database } from '../../core/database';
import { BaseController } from '../shared/base-controller';
import { ValidationUtil } from '../../core/utils/validation-util';
import { Emailer } from '../../email/emailer';
import { Validators } from '../../validation/validators';
import { LoginViewModel } from '../../view-models/create-user/login.view-model';
import { CreateUserViewModel } from '../../view-models/create-user/create-user.view-model';
import { NewsletterMemberViewModel } from '../../view-models/newsletter/newsletter-member.view-model';
import { ForgotPasswordViewModel } from '../../view-models/forgot-password/forgot-password.view-model';
import { ChangeForgottenPasswordViewModel } from '../../view-models/forgot-password/change-forgotten-password.view-model';
import { UpdateAvatarViewModel } from '../../view-models/profile/update-avatar.view-model';
import { UpdateBioViewModel } from '../../view-models/profile/update-bio.view-model';
import { UpdatePasswordViewModel } from '../../view-models/profile/update-password.view-model';
import { FeedbackViewModel } from '../../view-models/feedback/feedback.view-model';

export class UsersController extends BaseController {
    private usersService: UsersService;

    constructor() {
        super();
        this.usersService = new UsersService();
    }

    public async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as CreateUserViewModel;

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

            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as LoginViewModel;

            const valid = Validators.required({ value: viewModel.emailOrUsername }) ||
                Validators.required({ value: viewModel.password }) ||
                Validators.minLength(6)({ value: viewModel.password }) ||
                null;

            if (valid !== null) {
                throw ValidationUtil.createValidationErrors(valid);
            }

            const response = await this.usersService.login(Database.getSession(req), viewModel.emailOrUsername, viewModel.password);
            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.usersService.getUserById(Database.getSession(req), this.getUserId(req));
            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async report(req: Request, res: Response, next: NextFunction) {
        try {
            // TODO: do something
            res.status(200).json({});
        } catch (error) {
            this.returnError(res, error);
        }
    }

    // TODO: not in use
    public async doesUsernameAndEmailExist(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as CreateUserViewModel;

            const response = await this.usersService.doesUsernameAndEmailExist(Database.getSession(req), viewModel.email, viewModel.username);
            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as ForgotPasswordViewModel;

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
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async changeForgottenPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as ChangeForgottenPasswordViewModel;

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
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const code = req.body.code;
            const valid = Validators.required({ value: code }) ||
                null;

            if (valid !== null) {
                throw ValidationUtil.createValidationErrors(valid);
            }

            const response = await this.usersService.verifyEmail(Database.getSession(req), this.getUserId(req), code);
            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async createNewsletterMember(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as NewsletterMemberViewModel;

            const valid = Validators.required({ value: viewModel.email }) ||
                null;

            if (valid !== null) {
                throw ValidationUtil.createValidationErrors(valid);
            }

            const response = await this.usersService.createNewsletterMember(Database.getSession(req), req.body);
            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async deleteNewsletterMember(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as NewsletterMemberViewModel;

            const valid = Validators.required({ value: viewModel.email }) ||
                null;

            if (valid !== null) {
                throw ValidationUtil.createValidationErrors(valid);
            }

            const response = await this.usersService.deleteNewsletterMember(Database.getSession(req), req.body);
            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async updateAvatar(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as UpdateAvatarViewModel;

            const response = await this.usersService.updateAvatar(Database.getSession(req), this.getUserId(req), viewModel.avatarUrl);
            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async updateBio(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as UpdateBioViewModel;

            const response = await this.usersService.updateBio(Database.getSession(req), this.getUserId(req), viewModel.content);
            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async updatePassword(req: Request, res: Response, next: NextFunction) {
        try {
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
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async resendEmailVerificationLink(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.usersService.getUserById(Database.getSession(req), this.getUserId(req));
            Emailer.resendEmailVerificationLinkEmail(response.email, response.emailCode);

            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async sendFeedback(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as FeedbackViewModel;

            const valid = Validators.required({ value: viewModel.content }) ||
                null;

            if (valid !== null) {
                throw ValidationUtil.createValidationErrors(valid);
            }

            Emailer.feedbackEmail(viewModel.content);
            res.status(200).json();
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.usersService.deleteUser(Database.getSession(req), this.getUserId(req));
            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }
}
