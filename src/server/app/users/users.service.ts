import { pbkdf2Sync, randomBytes } from 'crypto';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import * as sanitizedHTML from 'sanitize-html';
import { v4 as nodeUUId } from 'uuid';
import * as WebSocket from 'ws';
import { SocketDataModel } from '../../../shared/models/web-socket/socket-data.model';
import { ServerValidator } from '../../../shared/validation/validators';
import { DoesUsernameAndEmailExist } from '@shared/view-models/create-user/does-username-and-email-exist.view-model';
import { TokenViewModel } from '@shared/view-models/create-user/token.view-model';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { CardViewModel } from '@shared/view-models/payment/card.view-model';
import { CompletedTutorial } from '@shared/view-models/tutorial/completed-tutorial.view-model';
import { UserProfileViewModel } from '@shared/view-models/user/user-profile.view-model';
import { UserPublicViewModel } from '@shared/view-models/user/user-public.view-model';
import { emailBroker } from '../../communication/emailer-broker';
import { Authentication } from '../../core/middleware/authentication';
import { webSocketServer } from '../../core/middleware/web-socket-server';
import { environment } from '../../environments/environment';
import { BaseService } from '../shared/base-service';
import { usersRepository } from './users.repository';

class UsersService extends BaseService {

    constructor() {
        super();
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

    private async verifyPassword(password: string, salt: string, passwordAttempt: string): Promise<boolean> {
        const hashedPassword = await this.hashPassword(passwordAttempt, salt);
        if (password === hashedPassword) {
            return true;
        } else {
            return false;
        }
    }

    // #endregion

    async createUser(res: Response, email: string, username: string, password: string): Promise<void> {
        email = email.toLowerCase();

        const validation = await this.doesUsernameAndEmailExist(res, email, username.toLowerCase());
        if (!validation) {
            ServerValidator.addGlobalError(res, 'createUser', true);
            throw new Error();
        }
        if (!validation.emailExist && !validation.usernameExist) {
            const salt = await this.generateSalt();
            const hashedPassword = await this.hashPassword(password, salt);

            const user = await usersRepository.createUser(res, nodeUUId(), email, username, hashedPassword, salt, nodeUUId());

            if (!user) {
                throw new Error('User required');
            }

            // Send email
            emailBroker.welcome({
                email: user.email,
                username: user.username,
                verifyCode: user.emailCode
            });

            // Notify everyone there is another sign up
            // TODO: This should be extracted into a single place where it can be called from
            const wss = webSocketServer.getSocketServer();
            const dataModel = new SocketDataModel();
            dataModel.message = 'New sign up just now';
            const payload = JSON.stringify(dataModel);

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(payload);
                }
            });
        } else {
            if (validation.usernameExist) {
                ServerValidator.addFormError(res, 'username', { exists: true });
            }
            if (validation.emailExist) {
                ServerValidator.addFormError(res, 'email', { exists: true });
            }

            if (validation.usernameExist || validation.emailExist) {
                throw new Error();
            }
        }
    }

    async doesUsernameAndEmailExist(res: Response, email: string, username: string): Promise<DoesUsernameAndEmailExist> {
        email = email.toLowerCase();
        username = username.toLowerCase();

        const user = await usersRepository.doesUsernameAndEmailExist(res, email, username);

        if (!user) {
            throw new Error('User required');
        }

        return user;
    }

    async login(res: Response, emailOrUsername: string, password: string): Promise<TokenViewModel> {
        emailOrUsername = emailOrUsername.toLowerCase();

        const user = await usersRepository.getUserByEmailOrUsername(res, emailOrUsername);

        if (!user || !(await this.verifyPassword(user.password, user.passwordSalt, password))) {
            ServerValidator.addGlobalError(res, 'loginInvalidCredentials', true);
            throw new Error();
        }

        const viewModel = new TokenViewModel();
        const tokenData = {
            i: user.id,
            // u: user.username,
            // r: 'role'
        };

        // HS256 algorithm
        viewModel.token = sign(
            {
                exp: Math.floor(Date.now() / 1000) + (60 * 60), /* 1 hour */
                data: tokenData
            },
            environment.authentication.privateKey,
            {
                issuer: Authentication.issuerName
            });

        return viewModel;
    }

    async getUserProfile(res: Response): Promise<UserProfileViewModel> {
        const user = await usersRepository.getUserById(res, this.getUserId(res));

        if (!user) {
            throw new Error('User required');
        }

        const viewModel: UserProfileViewModel = {
            id: user.id,
            uId: user.uId,
            email: user.email,
            username: user.username,
            dateCreated: user.dateCreated,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            emailVerified: user.emailVerified,
            paymentCards: user.paymentCards.map(card => {
                const cardViewModel: CardViewModel = {
                    uId: card.uId,
                    expireMonth: card.expireMonth,
                    expireYear: card.expireYear,
                    brand: card.brand,
                    last4: card.last4,
                    isDefault: card.isDefault,
                };
                return cardViewModel;
            }),
        };

        return viewModel;
    }

    async getUserPublic(res: Response, ip: string, userId: number): Promise<UserPublicViewModel> {
        const user = await usersRepository.getUserPublic(res, this.getOptionalUserId(res), ip, userId);

        if (!user) {
            throw new Error('User required');
        }

        return user;
    }

    async getUserPublicItems(res: Response, userId: number, pageIndex: number, pageSize: number)
        : Promise<ItemViewModel[] | null> {
        return await usersRepository.getUserPublicItems(res, this.getOptionalUserId(res), userId, pageIndex, pageSize);
    }

    async resendEmailVerificationLink(res: Response): Promise<void> {
        const user = await usersRepository.getLiteUserById(res, this.getUserId(res));

        if (!user) {
            throw new Error('User required');
        }

        emailBroker.resendEmailVerificationLink({
            email: user.email,
            verifyCode: user.emailCode
        });
    }

    async forgotPassword(res: Response, email: string, code: string): Promise<void> {
        email = email.toLowerCase();

        const user = await usersRepository.forgotPassword(res, email, code);

        if (!user) {
            // TODO: not sure if I should response with this as they can then see what emails are in use.
            ServerValidator.addGlobalError(res, 'forgotPasswordEmailNotFound', true);
            throw new Error();
        }

        emailBroker.forgotPassword({
            email: user.email,
            verifyCode: code
        });
    }

    async changeForgottenPassword(res: Response, email: string, code: string, password: string): Promise<void> {
        email = email.toLowerCase();

        const salt = await this.generateSalt();
        const hashedPassword = await this.hashPassword(password, salt);

        const user = await usersRepository.changeForgottenPassword(res, email, code, hashedPassword, salt);

        if (!user) {
            ServerValidator.addGlobalError(res, 'changeForgottenPassword', true);
            throw new Error();
        }

        emailBroker.passwordUpdated({
            email: user.email
        });
    }

    async verifyEmail(res: Response, code: string): Promise<boolean> {
        return await usersRepository.verifyEmail(res, this.getUserId(res), code);
    }

    async updateAvatar(res: Response, avatarUrl: string | null): Promise<void> {
        await usersRepository.updateAvatar(res, this.getUserId(res), avatarUrl);
    }

    async updateBio(res: Response, content: string): Promise<void> {
        const sanitizedHTMLContent = sanitizedHTML(content, {
            allowedTags: ['p', 'br', 'strong', 'em', 'h2', 'ul', 'ol', 'li', 'a', 'img'],
            allowedAttributes: {
                a: ['href', 'target'],
                img: ['src']
            },
            selfClosing: ['img', 'br'],
            allowedSchemes: ['https', 'mailto'],
            allowedSchemesAppliedToAttributes: ['href', 'src'],
            allowedIframeHostnames: ['www.youtube.com'],
            // TODO: the is required but think it's a bug. Remove in future version of sanitize-html
            parser: {}
        });

        await usersRepository.updateBio(res, this.getUserId(res), sanitizedHTMLContent);
    }

    async updatePassword(res: Response, password: string, newPassword: string): Promise<void> {
        const user = await usersRepository.getLiteUserById(res, this.getUserId(res));

        if (!user || !(await this.verifyPassword(user.password, user.passwordSalt, password))) {
            ServerValidator.addGlobalError(res, 'updatePasswordInvalid', true);
            throw new Error();
        }

        const salt = await this.generateSalt();
        const hashedPassword = await this.hashPassword(newPassword, salt);

        const updatedUser = await usersRepository.updatePassword(res, this.getUserId(res), hashedPassword, salt);

        if (!updatedUser) {
            ServerValidator.addGlobalError(res, 'updatePassword', true);
            throw new Error();
        }

        emailBroker.passwordUpdated({
            email: updatedUser.email
        });
    }

    async deleteUser(res: Response): Promise<boolean> {
        return await usersRepository.deleteUser(res, this.getUserId(res));
    }

    async completedTutorial(res: Response, viewModel: CompletedTutorial): Promise<boolean> {
        return await usersRepository.completedTutorial(res, this.getUserId(res), viewModel);
    }
}

export const usersService = new UsersService();
