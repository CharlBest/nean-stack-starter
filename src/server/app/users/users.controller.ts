import { NextFunction, Request, Response } from 'express';
import { v4 as nodeUUId } from 'uuid';
import { BuildFormGroup, ServerValidator } from '../../../shared/validation/new-validators';
import { trimString, Validators } from '../../../shared/validation/validators';
import { CreateUserViewModel } from '../../../shared/view-models/create-user/create-user.view-model';
import { LoginViewModel } from '../../../shared/view-models/create-user/login.view-model';
import { ChangeForgottenPasswordViewModel } from '../../../shared/view-models/forgot-password/change-forgotten-password.view-model';
import { ForgotPasswordViewModel } from '../../../shared/view-models/forgot-password/forgot-password.view-model';
import { UpdateAvatarViewModel } from '../../../shared/view-models/profile/update-avatar.view-model';
import { UpdateBioViewModel } from '../../../shared/view-models/profile/update-bio.view-model';
import { UpdatePasswordViewModel } from '../../../shared/view-models/profile/update-password.view-model';
import { CompletedTutorial } from '../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { ValidationUtil } from '../../core/utils/validation-util';
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

        res.status(201).json(
            await this.usersService.createUser(res, viewModel.email, viewModel.username, viewModel.password)
        );
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as LoginViewModel;

        // Trim inputs
        viewModel.emailOrUsername = trimString(viewModel.emailOrUsername);

        const formGroup = BuildFormGroup.login(viewModel.emailOrUsername, viewModel.password);
        const errors = ServerValidator.getErrors(formGroup);

        if (errors !== null) {
            throw ValidationUtil.createValidationErrors(errors);
        }

        res.status(200).json(
            await this.usersService.login(res, viewModel.emailOrUsername, viewModel.password)
        );
    }

    public async getUser(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await this.usersService.getUserById(res)
        );
    }

    public async report(req: Request, res: Response, next: NextFunction) {
        // TODO: do something
        res.sendStatus(200);
    }

    // TODO: not in use
    public async doesUsernameAndEmailExist(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as CreateUserViewModel;

        res.status(200).json(
            await this.usersService.doesUsernameAndEmailExist(res, viewModel.email, viewModel.username)
        );
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

        res.status(200).json(
            await this.usersService.forgotPassword(res, viewModel.email, nodeUUId())
        );
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

        res.status(200).json(
            await this.usersService.changeForgottenPassword(res, viewModel.email, viewModel.code, viewModel.password)
        );
    }

    public async verifyEmail(req: Request, res: Response, next: NextFunction) {
        const code = req.body.code;
        const valid = Validators.required({ value: code }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        res.status(200).json(
            await this.usersService.verifyEmail(res, code)
        );
    }

    public async updateAvatar(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UpdateAvatarViewModel;

        res.status(200).json(
            await this.usersService.updateAvatar(res, viewModel.avatarUrl)
        );
    }

    public async updateBio(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UpdateBioViewModel;

        res.status(200).json(
            await this.usersService.updateBio(res, viewModel.content)
        );
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

        res.status(200).json(
            await this.usersService.updatePassword(res, viewModel.password, viewModel.newPassword)
        );
    }

    public async resendEmailVerificationLink(req: Request, res: Response, next: NextFunction) {
        const response = await this.usersService.getUserById(res);
        await this.usersService.resendEmailVerificationLink(res, response.email, response.emailCode);

        res.status(200).json(response);
    }

    public async deleteUser(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await this.usersService.deleteUser(res)
        );
    }

    public async completedTutorial(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as CompletedTutorial;
        const valid = Validators.required({ value: viewModel.tutorialType }) ||
            null;

        if (valid !== null) {
            throw ValidationUtil.createValidationErrors(valid);
        }

        res.status(200).json(
            await this.usersService.completedTutorial(res, viewModel)
        );
    }
}
