// tslint:disable: no-identical-functions
import { NotificationType } from '../models/user/user.model';
import { FormValidator, PASSWORD_LENGTH, PASSWORD_REGEX, Validators } from './validators';

export class FormGroupBuilder {
    static createUser(email: string | null = null, username: string | null = null, password: string | null = null): FormValidator {
        return {
            email: [email, [
                Validators.required,
                Validators.email
            ]],
            username: [username, [
                Validators.required
            ]],
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.pattern(PASSWORD_REGEX)
            ]]
        };
    }

    static feedback(content: string | null = null): FormValidator {
        return {
            content: [content, [
                Validators.required,
                Validators.minLength(10)
            ]]
        };
    }

    static login(emailOrUsername: string | null = null, password: string | null = null, twoFactorAuthenticationCode: string | null = null)
        : FormValidator {
        return {
            emailOrUsername: [emailOrUsername, [
                Validators.required
            ]],
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH)
            ]],
            twoFactorAuthenticationCode: [twoFactorAuthenticationCode, [
                Validators.minLength(6)
            ]]
        };
    }

    static changeForgottenPassword(password: string | null = null): FormValidator {
        return {
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.pattern(PASSWORD_REGEX)
            ]]
        };
    }

    static forgotPassword(email: string | null = null): FormValidator {
        return {
            email: [email, [
                Validators.required,
                Validators.email
            ]]
        };
    }

    static updatePassword(password: string | null = null, newPassword: string | null = null, confirmPassword: string | null = null)
        : FormValidator {
        return {
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH)
            ]],
            newPassword: [newPassword, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.pattern(PASSWORD_REGEX)
            ]],
            confirmPassword: [confirmPassword, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH)
            ]]
        };
    }

    static payment(amount: number | null = null, cardUId: string | null = null, saveCard: boolean | null = null,
        email: string | null = null): FormValidator {
        return {
            amount: [amount, [
                Validators.required
            ]],
            cardUId: [cardUId, []],
            saveCard: [saveCard, []],
            email: [email, []],
        };
    }

    static newsletter(email: string | null = null): FormValidator {
        return {
            email: [email, [
                Validators.required,
                Validators.email
            ]]
        };
    }

    static createOrUpdateItem(title: string | null = null, description: string | null = null, media: Array<string> | null = null)
        : FormValidator {
        return {
            title: [title, [
                Validators.required
            ]],
            description: [description],
            media: [media]
        };
    }

    static createOrUpdateComment(description: string | null = null): FormValidator {
        return {
            description: [description, [
                Validators.required
            ]]
        };
    }

    static updateNotificationPreferences(pushNotificationEnabled: NotificationType = null, emailEnabled: NotificationType = null,
        autoSubscribeToItem: NotificationType = null, pushNewComment: NotificationType = null, pushHot: NotificationType = null,
        emailNewComment: NotificationType = null, emailHot: NotificationType = null): FormValidator {
        return {
            pushNotificationEnabled: [pushNotificationEnabled, [
                Validators.required
            ]],
            emailEnabled: [emailEnabled, [
                Validators.required
            ]],
            autoSubscribeToItem: [autoSubscribeToItem, [
                Validators.required
            ]],
            pushNewComment: [pushNewComment, [
                Validators.required
            ]],
            pushHot: [pushHot, [
                Validators.required
            ]],
            emailNewComment: [emailNewComment, [
                Validators.required
            ]],
            emailHot: [emailHot, [
                Validators.required
            ]],
        };
    }

    static search(term: string | null = null): FormValidator {
        return {
            term: [term, [
                Validators.required
            ]]
        };
    }

    static updateTwoFactorAuthentication(twoFactorAuthenticationEnabled: boolean | null = null): FormValidator {
        return {
            twoFactorAuthenticationEnabled: [twoFactorAuthenticationEnabled, [
                Validators.required
            ]]
        };
    }

    static orderFavourite(newOrderVal: number | null = null, originalOrderVal: number | null = null): FormValidator {
        return {
            newOrderVal: [newOrderVal, [
                Validators.required
            ]],
            originalOrderVal: [originalOrderVal, [
                Validators.required
            ]]
        };
    }
}
