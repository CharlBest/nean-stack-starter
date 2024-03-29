import { UserTokenModel } from '@shared/models/shared/user-token.model';
import { NewSignUpWebSocketModel } from '@shared/models/web-socket/new-sign-up-web-socket.model';
import { WebSocketType } from '@shared/models/web-socket/web-socket.enum';
import { translateService } from '@shared/translate/translate.service';
import { ServerValidator } from '@shared/validation/validators';
import { DoesUsernameAndEmailExist } from '@shared/view-models/create-user/does-username-and-email-exist.view-model';
import { TokenViewModel } from '@shared/view-models/create-user/token.view-model';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { CompletedTutorial } from '@shared/view-models/tutorial/completed-tutorial.view-model';
import { TwoFactorAuthenticationViewModel } from '@shared/view-models/user/two-factor-authentication.view-model';
import { UserProfileViewModel } from '@shared/view-models/user/user-profile.view-model';
import { UserPublicViewModel } from '@shared/view-models/user/user-public.view-model';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import { authenticator } from 'otplib';
import * as sanitizedHTML from 'sanitize-html';
import { hashPassword, verifyPassword } from 'server/core/utils/password';
import { v4 as nodeUUId } from 'uuid';
import { FileModel } from '../../../shared/models/shared/file.model';
import { Language } from '../../../shared/translate/language.enum';
import { emailBroker } from '../../communication/emailer-broker';
import { Authentication } from '../../core/middleware/authentication';
import { webSocketServer } from '../../core/middleware/web-socket-server';
import { environment } from '../../environments/environment';
import { paymentsService } from '../payments/payments.service';
import { BaseService } from '../shared/base-service';
import { usersRepository } from './users.repository';

class UsersService extends BaseService {

    readonly userRequiredError = 'User required';

    constructor() {
        super();
    }

    async createUser(res: Response, email: string, username: string, password: string): Promise<void> {
        email = email.toLowerCase();

        const validation = await this.doesUsernameAndEmailExist(res, email, username.toLowerCase());
        if (!validation) {
            ServerValidator.addGlobalError(res, 'createUser', true);
            throw new Error();
        }
        if (!validation.emailExist && !validation.usernameExist) {
            const passwordHash = await hashPassword(password);

            const user = await usersRepository.createUser(res, nodeUUId(), email, username, passwordHash, nodeUUId());

            if (!user) {
                throw new Error(this.userRequiredError);
            }

            // Send email
            emailBroker.welcome({
                email: user.email,
                username: user.username,
                verifyCode: user.emailCode
            });

            // Notify everyone there is another sign up
            const model = new NewSignUpWebSocketModel();
            model.message = translateService.ts(res, 'newSignUpJustNow');
            model.type = WebSocketType.NEW_SIGN_UP;
            webSocketServer.send(model);
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
            throw new Error(this.userRequiredError);
        }

        return user;
    }

    async login(res: Response, emailOrUsername: string, password: string, twoFactorAuthenticationCode: string | undefined)
        : Promise<TokenViewModel> {
        emailOrUsername = emailOrUsername.toLowerCase();

        const user = await usersRepository.getUserByEmailOrUsername(res, emailOrUsername);

        // Check password
        if (!user || !(await verifyPassword(password, user.passwordHash))) {
            ServerValidator.addGlobalError(res, 'loginInvalidCredentials', true);
            throw new Error();
        }

        const viewModel = new TokenViewModel();
        viewModel.twoFactorAuthenticationEnabled = user.twoFactorAuthenticationEnabled;

        // Check two factor authentication
        if (user.twoFactorAuthenticationEnabled) {
            if (!twoFactorAuthenticationCode) {
                // Return to client asking for code
                return viewModel;
            } else {
                let isCodeValid = false;
                try {
                    isCodeValid = authenticator.check(twoFactorAuthenticationCode, user.twoFactorAuthenticationSecret);
                } catch (err) {
                    // Error possibly thrown by the thirty-two package
                    // 'Invalid input - it is not base32 encoded string'
                    // TODO: error handling?
                }

                if (!isCodeValid) {
                    ServerValidator.addFormError(res, 'twoFactorAuthenticationCode', { invalid: true });
                    throw new Error();
                }
            }
        }

        const tokenData: UserTokenModel = {
            i: user.id,
            // u: user.username,
            // r: 'role'
        };

        // HS256 algorithm. TODO: is this the best algorithm to encrypt token with?
        viewModel.token = sign(
            {
                exp: Math.floor(Date.now() / 1000) + (60 * 60), /* 1 hour */
                data: tokenData
            },
            environment.authentication.privateKey,
            {
                issuer: Authentication.issuerName
            });

        viewModel.email = user.email;
        viewModel.username = user.username;
        viewModel.consent = user.consent;
        viewModel.darkTheme = user.darkTheme;
        viewModel.language = user.language;

        return viewModel;
    }

    async getUserProfile(res: Response): Promise<UserProfileViewModel> {
        const user = await usersRepository.getUserProfile(res, this.getUserId(res));

        if (!user) {
            throw new Error(this.userRequiredError);
        }

        return {
            id: user.id,
            uId: user.uId,
            email: user.email,
            username: user.username,
            dateCreated: user.dateCreated,
            bio: user.bio,
            avatar: user.avatar,
            emailVerified: user.emailVerified,
            twoFactorAuthenticationEnabled: user.twoFactorAuthenticationEnabled,
            paymentCards: await paymentsService.getStripeCards(user.stripeCustomerId)
        };
    }

    async getUserPublic(res: Response, ip: string, userId: number): Promise<UserPublicViewModel> {
        const user = await usersRepository.getUserPublic(res, this.getOptionalUserId(res), ip, userId);

        if (!user) {
            throw new Error(this.userRequiredError);
        }

        return user;
    }

    async getUserPublicItems(res: Response, userId: number, tags: Array<string> | null, pageIndex: number, pageSize: number)
        : Promise<ItemViewModel[] | null> {
        return await usersRepository.getUserPublicItems(res, this.getOptionalUserId(res), userId, tags, pageIndex, pageSize);
    }

    async resendEmailVerificationLink(res: Response): Promise<void> {
        const user = await usersRepository.getLiteUserById(res, this.getUserId(res));

        if (!user) {
            throw new Error(this.userRequiredError);
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

        const passwordHash = await hashPassword(password);

        const user = await usersRepository.changeForgottenPassword(res, email, code, passwordHash);

        if (!user) {
            ServerValidator.addGlobalError(res, 'changeForgottenPassword', true);
            throw new Error();
        }

        emailBroker.passwordUpdated({
            email: user.email
        });
    }

    async updatePassword(res: Response, password: string, newPassword: string): Promise<void> {
        const user = await usersRepository.getLiteUserById(res, this.getUserId(res));

        if (!user || !(await verifyPassword(password, user.passwordHash))) {
            ServerValidator.addGlobalError(res, 'updatePasswordInvalid', true);
            throw new Error();
        }

        const passwordHash = await hashPassword(newPassword);

        const updatedUser = await usersRepository.updatePassword(res, this.getUserId(res), passwordHash);

        if (!updatedUser) {
            ServerValidator.addGlobalError(res, 'updatePassword', true);
            throw new Error();
        }

        emailBroker.passwordUpdated({
            email: updatedUser.email
        });
    }

    async verifyEmail(res: Response, code: string): Promise<boolean> {
        return await usersRepository.verifyEmail(res, this.getUserId(res), code);
    }

    async updateAvatar(res: Response, avatar: FileModel | null): Promise<void> {
        if (avatar) {
            avatar.uId = nodeUUId();
        }
        await usersRepository.updateAvatar(res, this.getUserId(res), avatar);
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

    async deleteUser(res: Response): Promise<boolean> {
        return await usersRepository.deleteUser(res, this.getUserId(res));
    }

    async completedTutorial(res: Response, viewModel: CompletedTutorial): Promise<boolean> {
        return await usersRepository.completedTutorial(res, this.getUserId(res), viewModel);
    }

    async updateTwoFactorAuthentication(res: Response, isEnabled: boolean): Promise<TwoFactorAuthenticationViewModel | null> {
        let generatedSecret = null;
        if (isEnabled) {
            generatedSecret = authenticator.generateSecret();
        }

        const user = await usersRepository.updateTwoFactorAuthentication(res, this.getUserId(res), isEnabled, generatedSecret);

        if (!user) {
            ServerValidator.addGlobalError(res, 'updateTwoFactorAuthentication', true);
            throw new Error();
        }

        const viewModel = new TwoFactorAuthenticationViewModel();
        viewModel.qrCodeKeyUri = authenticator.keyuri(user.email, 'NEAN', user.twoFactorAuthenticationSecret);
        return viewModel;
    }

    async updateConfiguration(res: Response, consent: boolean | undefined = false,
        darkTheme: boolean | undefined = false, language: Language | undefined): Promise<boolean> {
        if (language) {
            const exists = translateService.doesLanguageKeyExist(language);
            language = exists ? language : undefined;
        }

        return await usersRepository.updateConfiguration(res, this.getUserId(res), consent, darkTheme, language);
    }
}

export const usersService = new UsersService();
