import { pbkdf2Sync, randomBytes } from 'crypto';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import * as stripe from 'stripe';
import { v4 as nodeUUId } from 'uuid';
import * as webSocket from 'ws';
import { UserCardModel } from '../../../shared/models/user/user-card.model';
import { UserModel } from '../../../shared/models/user/user.model';
import { ServerValidator } from '../../../shared/validation/validators';
import { DoesUsernameAndEmailExist } from '../../../shared/view-models/create-user/does-username-and-email-exist.view-model';
import { TokenViewModel } from '../../../shared/view-models/create-user/token.view-model';
import { CompletedTutorial } from '../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { Authentication } from '../../core/middleware/authentication';
import { WebSocketServer } from '../../core/middleware/web-socket-server';
import { ValidationUtil } from '../../core/utils/validation-util';
import { Emailer } from '../../email/emailer';
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
        email = email.toLowerCase();
        username = username.toLowerCase();

        const validation = await this.doesUsernameAndEmailExist(res, email, username);
        if (validation === null || validation === undefined) {
            ServerValidator.addGlobalError(res, 'error', true);
            throw ValidationUtil.errorResponse(res);
        }
        if (!validation.emailExist && !validation.usernameExist) {
            const salt = await this.generateSalt();
            const hashedPassword = await this.hashPassword(password, salt);

            const user = await this.usersRepository.createUser(res, nodeUUId(), email, username, hashedPassword, salt, nodeUUId());

            // Send email
            Emailer.welcomeEmail(user.email, user.username, user.emailCode);

            // Notify everyone there is another sign up
            const wss = WebSocketServer.getSocketServer();
            wss.clients.forEach(client => {
                if (client.readyState === webSocket.OPEN) {
                    client.send('New sign up just now');
                }
            });

            return user;
        } else {
            if (validation.usernameExist) {
                ServerValidator.addFormError(res, 'username', { exists: true });
            }
            if (validation.emailExist) {
                ServerValidator.addFormError(res, 'email', { exists: true });
            }

            if (validation.usernameExist || validation.emailExist) {
                throw ValidationUtil.errorResponse(res);
            }
        }
    }

    public async doesUsernameAndEmailExist(res: Response, email: string, username: string): Promise<DoesUsernameAndEmailExist> {
        email = email.toLowerCase();
        username = username.toLowerCase();

        return await this.usersRepository.doesUsernameAndEmailExist(res, email, username);
    }

    public async login(res: Response, emailOrUsername: string, password: string): Promise<TokenViewModel> {
        emailOrUsername = emailOrUsername.toLowerCase();

        const user = await this.usersRepository.getUser(res, emailOrUsername);

        if (user === null || !(await this.verifyPassword(user.password, user.passwordSalt, password))) {
            ServerValidator.addGlobalError(res, 'invalidCredentials', true);
            throw ValidationUtil.errorResponse(res);
        }

        const viewModel = new TokenViewModel();
        viewModel.userId = user.id;
        const tokenData = {
            id: user.id,
            username: user.username
        };

        // TODO: TTL on token! '1h'
        viewModel.token = sign(
            {
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: tokenData
            },
            environment.authentication.privateKey,
            {
                issuer: Authentication.issuerName
            });

        return viewModel;
    }

    public async getUserById(res: Response): Promise<UserModel> {
        return await this.usersRepository.getUserById(res, this.getUserId(res));
    }

    public async resendEmailVerificationLink(res: Response, email: string, emailCode: string): Promise<void> {
        Emailer.resendEmailVerificationLinkEmail(email, emailCode);
    }

    public async forgotPassword(res: Response, email: string, code: string): Promise<UserModel> {
        email = email.toLowerCase();

        const user = await this.usersRepository.forgotPassword(res, email, code);

        if (user === null) {
            // TODO: not sure if I should response with this as they can then see what emails are in use.
            ServerValidator.addGlobalError(res, 'email', { notFound: true });
            throw ValidationUtil.errorResponse(res);
        }

        Emailer.forgotPasswordEmail(user.email, code);

        return user;
    }

    public async changeForgottenPassword(res: Response, email: string, code: string, password: string): Promise<UserModel> {
        email = email.toLowerCase();

        const salt = await this.generateSalt();
        const hashedPassword = await this.hashPassword(password, salt);

        const user = await this.usersRepository.changeForgottenPassword(res, email, code, hashedPassword, salt);

        if (user === null) {
            ServerValidator.addGlobalError(res, 'password', { error: true });
            throw ValidationUtil.errorResponse(res);
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
            ServerValidator.addGlobalError(res, 'password', { invalid: true });
            throw ValidationUtil.errorResponse(res);
        }

        const salt = await this.generateSalt();
        const hashedPassword = await this.hashPassword(newPassword, salt);

        const updatedUser = await this.usersRepository.updatePassword(res, this.getUserId(res), hashedPassword, salt);

        if (updatedUser === null) {
            ServerValidator.addGlobalError(res, 'password', { error: true });
            throw ValidationUtil.errorResponse(res);
        }

        return updatedUser;
    }

    public async deleteUser(res: Response): Promise<boolean> {
        return await this.usersRepository.deleteUser(res, this.getUserId(res));
    }

    public async completedTutorial(res: Response, viewModel: CompletedTutorial): Promise<boolean> {
        return await this.usersRepository.completedTutorial(res, this.getUserId(res), viewModel);
    }

    public async userPayment(res: Response, cardUId: string, token: string, amount: number): Promise<boolean> {
        const stripeAccount = new stripe(environment.stripe.secretKey);
        const paymentUId = nodeUUId();

        try {
            const charge = await stripeAccount.charges.create({
                amount: amount * 100,
                currency: 'EUR',
                description: 'NEAN donation',
                source: token,
                metadata: { 'paymentUId': paymentUId },
            });

            return await this.usersRepository.userPayment(res, this.getUserId(res), paymentUId, charge.id, charge.created, token, amount);
        } catch {
            ServerValidator.addGlobalError(res, 'error', true);
            throw ValidationUtil.errorResponse(res);
        }
    }

    public async userCards(res: Response): Promise<UserCardModel[]> {
        return await this.usersRepository.userCards(res, this.getUserId(res));
    }

    public async createCard(res: Response, token: string): Promise<boolean> {
        const user = await this.getUserById(res);

        const stripeAccount = new stripe(environment.stripe.secretKey);

        const customer = await stripeAccount.customers.create({
            source: token,
            email: user.email,
        });

        return await this.usersRepository.createCard(res, this.getUserId(res), token);
    }

    public async deleteCard(res: Response, token: string, amount: number): Promise<boolean> {
        const stripeAccount = new stripe(environment.stripe.secretKey);
        const paymentUId = nodeUUId();

        try {
            const charge = await stripeAccount.charges.create({
                amount: amount * 100,
                currency: 'EUR',
                description: 'NEAN donation',
                source: token,
                metadata: { 'paymentUId': paymentUId },
            });

            return await this.usersRepository.deleteCard(res, this.getUserId(res), 'cardUId');
        } catch {
            ServerValidator.addGlobalError(res, 'error', true);
            throw ValidationUtil.errorResponse(res);
        }
    }
}
