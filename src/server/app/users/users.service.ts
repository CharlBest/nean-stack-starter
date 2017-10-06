import { v1 as neo4j } from 'neo4j-driver';
import { v4 as nodeUUId } from 'node-uuid';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { sign } from 'jsonwebtoken';
import { UsersRepository } from './users.repository';
import { IUsersService } from './iusers.service';
import { BaseService } from '../shared/base-service';
import { NewsletterMemberViewModel } from '../../view-models/newsletter/newsletter-member.view-model';
import { TokenViewModel } from '../../view-models/create-user/token.view-model';
import { environment } from '../../environments/environment';
import { UserModel } from '../../models/user/user.model';
import { ValidationUtil } from '../../core/utils/validation-util';
import { DoesUsernameAndEmailExist } from '../../view-models/create-user/does-username-and-email-exist.view-model';
import { TutorialType } from '../../view-models/tutorial/tutorial-type.enum';

export class UsersService extends BaseService implements IUsersService {

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

    public async createUser(session: neo4j.Session, email: string, username: string, password: string): Promise<UserModel> {
        const validation = await this.doesUsernameAndEmailExist(session, email, username);
        if (validation === null || validation === undefined) {
            throw ValidationUtil.createValidationErrorMessage('general', 'Validation failed');
        }
        if (!validation.emailExist && !validation.usernameExist) {
            const salt = await this.generateSalt();
            const hashedPassword = await this.hashPassword(password, salt);

            return await this.usersRepository.createUser(session, nodeUUId(), email, username, hashedPassword, salt, nodeUUId());
        } else {
            if (validation.usernameExist) {
                throw ValidationUtil.createValidationErrorMessage('username', 'Username already exists');
            }
            if (validation.emailExist) {
                throw ValidationUtil.createValidationErrorMessage('email', 'Email already exists');
            }
        }
    }

    public async doesUsernameAndEmailExist(session: neo4j.Session, email: string, username: string): Promise<DoesUsernameAndEmailExist> {
        return await this.usersRepository.doesUsernameAndEmailExist(session, email, username);
    }

    public async login(session: neo4j.Session, emailOrUsername: string, password: string): Promise<TokenViewModel> {
        const user = await this.usersRepository.getUser(session, emailOrUsername);

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

    public async getUserById(session: neo4j.Session, userId: number): Promise<UserModel> {
        return await this.usersRepository.getUserById(session, userId);
    }

    public async forgotPassword(session: neo4j.Session, email: string, code: string): Promise<UserModel> {
        const user = await this.usersRepository.forgotPassword(session, email, code);

        if (user === null) {
            // TODO: not sure if I should response with this as they can then see what emails are in use.
            throw ValidationUtil.createValidationErrorMessage('email', 'Email not found');
        }

        return user;
    }

    public async changeForgottenPassword(session: neo4j.Session, email: string, code: string, password: string): Promise<UserModel> {
        const salt = await this.generateSalt();
        const hashedPassword = await this.hashPassword(password, salt);

        const user = await this.usersRepository.changeForgottenPassword(session, email, code, hashedPassword, salt);

        if (user === null) {
            throw ValidationUtil.createValidationErrorMessage('password', 'Error occurred');
        }

        return user;
    }

    public async createNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        return await this.usersRepository.createNewsletterMember(session, viewModel);
    }

    public async deleteNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        return await this.usersRepository.deleteNewsletterMember(session, viewModel);
    }

    public async verifyEmail(session: neo4j.Session, userId: number, code: string): Promise<boolean> {
        return await this.usersRepository.verifyEmail(session, userId, code);
    }

    public async updateAvatar(session: neo4j.Session, userId: number, avatarUrl: string): Promise<UserModel> {
        return await this.usersRepository.updateAvatar(session, userId, avatarUrl);
    }

    public async updateBio(session: neo4j.Session, userId: number, bio: string): Promise<UserModel> {
        return await this.usersRepository.updateBio(session, userId, bio);
    }

    public async updatePassword(session: neo4j.Session, userId: number, password: string, newPassword: string): Promise<UserModel> {
        const user = await this.usersRepository.getUserById(session, userId);

        if (user === null || !(await this.verifyPassword(user.password, user.passwordSalt, password))) {
            throw ValidationUtil.createValidationErrorMessage('password', 'Invalid password');
        }

        const salt = await this.generateSalt();
        const hashedPassword = await this.hashPassword(newPassword, salt);

        const updatedUser = await this.usersRepository.updatePassword(session, userId, hashedPassword, salt);

        if (updatedUser === null) {
            throw ValidationUtil.createValidationErrorMessage('password', 'Error occurred');
        }

        return updatedUser;
    }

    public async deleteUser(session: neo4j.Session, userId: number): Promise<boolean> {
        return await this.usersRepository.deleteUser(session, userId);
    }

    public async completedTutorial(session: neo4j.Session, userId: number, tutorialType: TutorialType): Promise<boolean> {
        return await this.usersRepository.completedTutorial(session, userId, tutorialType);
    }
}
