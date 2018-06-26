import { pbkdf2Sync, randomBytes } from 'crypto';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import { v4 as nodeUUId } from 'uuid';
import { UserModel } from '../../../shared/models/user/user.model';
import { DoesUsernameAndEmailExist } from '../../../shared/view-models/create-user/does-username-and-email-exist.view-model';
import { TokenViewModel } from '../../../shared/view-models/create-user/token.view-model';
import { CompletedTutorial } from '../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { ValidationUtil } from '../../core/utils/validation-util';
import { environment } from '../../environments/environment';
import { BaseService } from '../shared/base-service';
import { UsersRepository } from './users.repository';

export class UsersService extends BaseService {

    private usersRepository: UsersRepository;

    constructor() {
        super();
        this.usersRepository = new UsersRepository();
    }

    // #region private

    private async generateSalt(): Promise<string> {
        const saltBuffer = await randomBytes(16);
        return saltBuffer.toString('hex');
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        // TODO: change to async
        const hashedPassword = pbkdf2Sync(password, salt, 10000, 32, 'sha512');
        return hashedPassword.toString('hex');
    }

    private async verifyPassword(password, salt, passwordAttempt): Promise<boolean> {
        const hashedPassword = await this.hashPassword(passwordAttempt, salt);
        if (password === hashedPassword) {
            return true;
        } else {
            return false;
        }
    }

    // #endregion

    public async createUser(res: Response, email: string, username: string, password: string): Promise<UserModel> {
        const validation = await this.doesUsernameAndEmailExist(res, email, username);
        if (validation === null || validation === undefined) {
            throw ValidationUtil.createValidationErrorMessage('general', 'Validation failed');
        }
        if (!validation.emailExist && !validation.usernameExist) {
            const salt = await this.generateSalt();
            const hashedPassword = await this.hashPassword(password, salt);

            return await this.usersRepository.createUser(res, nodeUUId(), email, username, hashedPassword, salt, nodeUUId());
        } else {
            if (validation.usernameExist) {
                throw ValidationUtil.createValidationErrorMessage('username', 'Username already exists');
            }
            if (validation.emailExist) {
                throw ValidationUtil.createValidationErrorMessage('email', 'Email already exists');
            }
        }
    }

    public async doesUsernameAndEmailExist(res: Response, email: string, username: string): Promise<DoesUsernameAndEmailExist> {
        return await this.usersRepository.doesUsernameAndEmailExist(res, email, username);
    }

    public async login(res: Response, emailOrUsername: string, password: string): Promise<TokenViewModel> {
        const user = await this.usersRepository.getUser(res, emailOrUsername);

        if (user === null || !(await this.verifyPassword(user.password, user.passwordSalt, password))) {
            throw ValidationUtil.createValidationErrorMessage('password', 'Invalid username or password');
        }

        const viewModel = new TokenViewModel();
        viewModel.userId = user.id;
        const tokenData = {
            id: user.id,
            username: user.username
        };

        // TODO: TTL on token! '1h'
        viewModel.token = sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: tokenData
        }, environment.authentication.privateKey);

        return viewModel;
    }

    public async getUserById(res: Response): Promise<UserModel> {
        return await this.usersRepository.getUserById(res, this.getUserId(res));
    }

    public async forgotPassword(res: Response, email: string, code: string): Promise<UserModel> {
        const user = await this.usersRepository.forgotPassword(res, email, code);

        if (user === null) {
            // TODO: not sure if I should response with this as they can then see what emails are in use.
            throw ValidationUtil.createValidationErrorMessage('email', 'Email not found');
        }

        return user;
    }

    public async changeForgottenPassword(res: Response, email: string, code: string, password: string): Promise<UserModel> {
        const salt = await this.generateSalt();
        const hashedPassword = await this.hashPassword(password, salt);

        const user = await this.usersRepository.changeForgottenPassword(res, email, code, hashedPassword, salt);

        if (user === null) {
            throw ValidationUtil.createValidationErrorMessage('password', 'Error occurred');
        }

        return user;
    }

    public async verifyEmail(res: Response, code: string): Promise<boolean> {
        return await this.usersRepository.verifyEmail(res, this.getUserId(res), code);
    }

    public async updateAvatar(res: Response, avatarUrl: string): Promise<UserModel> {
        return await this.usersRepository.updateAvatar(res, this.getUserId(res), avatarUrl);
    }

    public async updateBio(res: Response, bio: string): Promise<UserModel> {
        return await this.usersRepository.updateBio(res, this.getUserId(res), bio);
    }

    public async updatePassword(res: Response, password: string, newPassword: string): Promise<UserModel> {
        const user = await this.usersRepository.getUserById(res, this.getUserId(res));

        if (user === null || !(await this.verifyPassword(user.password, user.passwordSalt, password))) {
            throw ValidationUtil.createValidationErrorMessage('password', 'Invalid password');
        }

        const salt = await this.generateSalt();
        const hashedPassword = await this.hashPassword(newPassword, salt);

        const updatedUser = await this.usersRepository.updatePassword(res, this.getUserId(res), hashedPassword, salt);

        if (updatedUser === null) {
            throw ValidationUtil.createValidationErrorMessage('password', 'Error occurred');
        }

        return updatedUser;
    }

    public async deleteUser(res: Response): Promise<boolean> {
        return await this.usersRepository.deleteUser(res, this.getUserId(res));
    }

    public async completedTutorial(res: Response, viewModel: CompletedTutorial): Promise<boolean> {
        return await this.usersRepository.completedTutorial(res, this.getUserId(res), viewModel);
    }
}
