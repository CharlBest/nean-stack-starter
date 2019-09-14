// tslint:disable: no-identical-functions
import { FileModel } from '../models/shared/file.model';
import { NotificationType } from '../models/user/user.model';
import { FormValidator, PASSWORD_LENGTH, PASSWORD_REGEX, Validators } from './validators';

export class FormGroupBuilder {
    static createUser(email: string | null = null, username: string | null = null, password: string | null = null): FormValidator {
        return {
            email: [email, [
                Validators.required,
                Validators.email,
                Validators.typeAssert(email, 'string'),
            ]],
            username: [username, [
                Validators.required,
                Validators.typeAssert(username, 'string'),
            ]],
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.pattern(PASSWORD_REGEX),
                Validators.typeAssert(password, 'string'),
            ]]
        };
    }

    static feedback(content: string | null = null): FormValidator {
        return {
            content: [content, [
                Validators.required,
                Validators.minLength(10),
                Validators.typeAssert(content, 'string'),
            ]]
        };
    }

    static login(emailOrUsername: string | null = null, password: string | null = null, twoFactorAuthenticationCode: string | null = null)
        : FormValidator {
        return {
            emailOrUsername: [emailOrUsername, [
                Validators.required,
                Validators.typeAssert(emailOrUsername, 'string'),
            ]],
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.typeAssert(password, 'string'),
            ]],
            twoFactorAuthenticationCode: [twoFactorAuthenticationCode, [
                Validators.minLength(6),
                Validators.typeAssert(twoFactorAuthenticationCode, 'string'),
            ]]
        };
    }

    static changeForgottenPassword(password: string | null = null): FormValidator {
        return {
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.pattern(PASSWORD_REGEX),
                Validators.typeAssert(password, 'string'),
            ]]
        };
    }

    static forgotPassword(email: string | null = null): FormValidator {
        return {
            email: [email, [
                Validators.required,
                Validators.email,
                Validators.typeAssert(email, 'string'),
            ]]
        };
    }

    static updatePassword(password: string | null = null, newPassword: string | null = null, confirmPassword: string | null = null)
        : FormValidator {
        return {
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.typeAssert(password, 'string'),
            ]],
            newPassword: [newPassword, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.pattern(PASSWORD_REGEX),
                Validators.typeAssert(newPassword, 'string'),
            ]],
            confirmPassword: [confirmPassword, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.typeAssert(confirmPassword, 'string'),
            ]]
        };
    }

    static payment(amount: number | null = null, cardUId: string | null = null, saveCard: boolean | null = null,
        email: string | null = null): FormValidator {
        return {
            amount: [amount, [
                Validators.required,
                Validators.typeAssert(amount, 'number'),
            ]],
            cardUId: [cardUId, [
                Validators.typeAssert(cardUId, 'string'),
            ]],
            saveCard: [saveCard, [
                Validators.typeAssert(saveCard, 'boolean'),
            ]],
            email: [email, [
                Validators.typeAssert(email, 'string'),
            ]],
        };
    }

    static newsletter(email: string | null = null): FormValidator {
        return {
            email: [email, [
                Validators.required,
                Validators.email,
                Validators.typeAssert(email, 'string'),
            ]]
        };
    }

    static createOrUpdateItem(title: string | null = null, description: string | null = null, files: Array<FileModel> | null = null)
        : FormValidator {
        return {
            title: [title, [
                Validators.required,
                Validators.typeAssert(title, 'string'),
            ]],
            description: [description, [
                Validators.typeAssert(description, 'string'),
            ]],
            files: [files, [
                Validators.typeAssert(files, 'files'),
            ]]
        };
    }

    static createOrUpdateComment(description: string | null = null): FormValidator {
        return {
            description: [description, [
                Validators.required,
                Validators.typeAssert(description, 'string'),
            ]]
        };
    }

    static updateNotificationPreferences(pushNotificationEnabled: NotificationType = null, emailEnabled: NotificationType = null,
        autoSubscribeToItem: NotificationType = null, pushNewComment: NotificationType = null, pushHot: NotificationType = null,
        emailNewComment: NotificationType = null, emailHot: NotificationType = null): FormValidator {
        return {
            pushNotificationEnabled: [pushNotificationEnabled, [
                Validators.required,
                Validators.typeAssert(pushNotificationEnabled, 'boolean'),
            ]],
            emailEnabled: [emailEnabled, [
                Validators.required,
                Validators.typeAssert(emailEnabled, 'boolean'),
            ]],
            autoSubscribeToItem: [autoSubscribeToItem, [
                Validators.required,
                Validators.typeAssert(autoSubscribeToItem, 'boolean'),
            ]],
            pushNewComment: [pushNewComment, [
                Validators.required,
                Validators.typeAssert(pushNewComment, 'boolean'),
            ]],
            pushHot: [pushHot, [
                Validators.required,
                Validators.typeAssert(pushHot, 'boolean'),
            ]],
            emailNewComment: [emailNewComment, [
                Validators.required,
                Validators.typeAssert(emailNewComment, 'boolean'),
            ]],
            emailHot: [emailHot, [
                Validators.required,
                Validators.typeAssert(emailHot, 'boolean'),
            ]],
        };
    }

    static search(term: string | null = null): FormValidator {
        return {
            term: [term, [
                Validators.required,
                Validators.typeAssert(term, 'string'),
            ]]
        };
    }

    static updateTwoFactorAuthentication(twoFactorAuthenticationEnabled: boolean | null = null): FormValidator {
        return {
            twoFactorAuthenticationEnabled: [twoFactorAuthenticationEnabled, [
                Validators.required,
                Validators.typeAssert(twoFactorAuthenticationEnabled, 'boolean'),
            ]]
        };
    }

    static orderFavourite(newOrderVal: number | null = null, originalOrderVal: number | null = null): FormValidator {
        return {
            newOrderVal: [newOrderVal, [
                Validators.required,
                Validators.typeAssert(newOrderVal, 'number'),
            ]],
            originalOrderVal: [originalOrderVal, [
                Validators.required,
                Validators.typeAssert(originalOrderVal, 'number'),
            ]]
        };
    }

    static updateConfiguration(consent: boolean | null = null, darkTheme: boolean | null = null, language: string | null = null)
        : FormValidator {
        return {
            consent: [consent, [
                Validators.typeAssert(consent, 'boolean'),
            ]],
            darkTheme: [darkTheme, [
                Validators.typeAssert(darkTheme, 'boolean'),
            ]],
            language: [language, [
                Validators.typeAssert(language, 'string'),
            ]],
        };
    }
}
