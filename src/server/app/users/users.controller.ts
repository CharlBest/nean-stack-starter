import { NextFunction, Request, Response } from 'express';
import { v4 as nodeUUId } from 'uuid';
import { BuildFormGroup, CustomValidators, ServerValidator, trimString } from '../../../shared/validation/validators';
import { CreateUserViewModel } from '../../../shared/view-models/create-user/create-user.view-model';
import { LoginViewModel } from '../../../shared/view-models/create-user/login.view-model';
import { ChangeForgottenPasswordViewModel } from '../../../shared/view-models/forgot-password/change-forgotten-password.view-model';
import { ForgotPasswordViewModel } from '../../../shared/view-models/forgot-password/forgot-password.view-model';
import { UserPaymentViewModel } from '../../../shared/view-models/payment/user-payment.view-model';
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

        const formGroup = BuildFormGroup.createUser(viewModel.email, viewModel.username, viewModel.password);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
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
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
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
        res.status(200).json();
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

        const formGroup = BuildFormGroup.forgotPassword(viewModel.email);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.usersService.forgotPassword(res, viewModel.email, nodeUUId())
        );
    }

    public async changeForgottenPassword(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as ChangeForgottenPasswordViewModel;

        // Trim inputs
        viewModel.email = trimString(viewModel.email);

        const formGroup = BuildFormGroup.changeForgottenPassword(viewModel.password);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'email', CustomValidators.required(viewModel.email));
        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'email', CustomValidators.email(viewModel.email));
        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'code', CustomValidators.required(viewModel.code));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.usersService.changeForgottenPassword(res, viewModel.email, viewModel.code, viewModel.password)
        );
    }

    public async verifyEmail(req: Request, res: Response, next: NextFunction) {
        const code = req.body.code;

        const hasErrors = ServerValidator.addGlobalError(res, 'code', CustomValidators.required(code));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
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

        const formGroup = BuildFormGroup.updatePassword(viewModel.password, viewModel.newPassword, viewModel.newPassword);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.usersService.updatePassword(res, viewModel.password, viewModel.newPassword)
        );
    }

    public async resendEmailVerificationLink(req: Request, res: Response, next: NextFunction) {
        const response = await this.usersService.getLiteUserById(res);
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

        // TODO: no UI element for this error
        const hasErrors = ServerValidator.addGlobalError(res, 'tutorialType', CustomValidators.required(viewModel.tutorialType));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.usersService.completedTutorial(res, viewModel)
        );
    }

    public async userPayment(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UserPaymentViewModel;

        const formGroup = BuildFormGroup.payment(viewModel.cardUId, viewModel.amount, viewModel.saveCard);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        const hasToken = ServerValidator.addGlobalError(res, 'token', CustomValidators.required(viewModel.token));
        const hasCard = ServerValidator.addGlobalError(res, 'cardUId', CustomValidators.required(viewModel.cardUId));

        if (hasErrors && (hasToken === null || hasCard === null)) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.usersService.userPayment(res, viewModel.cardUId, viewModel.token, viewModel.amount, viewModel.saveCard)
        );
    }

    public async userCards(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await this.usersService.userCards(res)
        );
    }

    public async createCard(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UserPaymentViewModel;

        const formGroup = BuildFormGroup.payment(viewModel.cardUId, viewModel.amount, viewModel.saveCard);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'token', CustomValidators.required(viewModel.token));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.usersService.createCard(res, viewModel.token)
        );
    }

    public async deleteCard(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UserPaymentViewModel;

        const formGroup = BuildFormGroup.payment(viewModel.cardUId, viewModel.amount, viewModel.saveCard);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'token', CustomValidators.required(viewModel.token));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.usersService.deleteCard(res, '')
        );
    }
}
