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
                Validators.typeAssert('string', email),
            ]],
            username: [username, [
                Validators.required,
                Validators.typeAssert('string', username),
            ]],
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.pattern(PASSWORD_REGEX),
                Validators.typeAssert('string', password),
            ]]
        };
    }

    static feedback(content: string | null = null): FormValidator {
        return {
            content: [content, [
                Validators.required,
                Validators.minLength(10),
                Validators.typeAssert('string', content),
            ]]
        };
    }

    static login(emailOrUsername: string | null = null, password: string | null = null, twoFactorAuthenticationCode: string | null = null)
        : FormValidator {
        return {
            emailOrUsername: [emailOrUsername, [
                Validators.required,
                Validators.typeAssert('string', emailOrUsername),
            ]],
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.typeAssert('string', password),
            ]],
            twoFactorAuthenticationCode: [twoFactorAuthenticationCode, [
                Validators.minLength(6),
                Validators.typeAssert('string', twoFactorAuthenticationCode),
            ]]
        };
    }

    static changeForgottenPassword(password: string | null = null): FormValidator {
        return {
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.pattern(PASSWORD_REGEX),
                Validators.typeAssert('string', password),
            ]]
        };
    }

    static forgotPassword(email: string | null = null): FormValidator {
        return {
            email: [email, [
                Validators.required,
                Validators.email,
                Validators.typeAssert('string', email),
            ]]
        };
    }

    static updatePassword(password: string | null = null, newPassword: string | null = null, confirmPassword: string | null = null)
        : FormValidator {
        return {
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.typeAssert('string', password),
            ]],
            newPassword: [newPassword, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.pattern(PASSWORD_REGEX),
                Validators.typeAssert('string', newPassword),
            ]],
            confirmPassword: [confirmPassword, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.typeAssert('string', confirmPassword),
            ]]
        };
    }

    static createCard(setAsDefault: boolean | null = null): FormValidator {
        return {
            setAsDefault: [setAsDefault, [
                Validators.typeAssert('boolean', setAsDefault),
            ]]
        };
    }

    static payment(amount: number | null = null, cardId: string | null = null, saveCard: boolean | null = null,
        email: string | null = null): FormValidator {
        return {
            amount: [amount, [
                Validators.required,
                Validators.typeAssert('number', amount),
            ]],
            cardId: [cardId, [
                Validators.typeAssert('string', cardId),
            ]],
            saveCard: [saveCard, [
                Validators.typeAssert('boolean', saveCard),
            ]],
            email: [email, [
                Validators.typeAssert('string', email),
            ]],
        };
    }

    static newsletter(email: string | null = null): FormValidator {
        return {
            email: [email, [
                Validators.required,
                Validators.email,
                Validators.typeAssert('string', email),
            ]]
        };
    }

    static createOrUpdateItem(title: string | null = null, description: string | null = null,
        files: Array<FileModel> | null = null, tags: Array<string> | null = null)
        : FormValidator {
        return {
            title: [title, [
                Validators.required,
                Validators.typeAssert('string', title),
            ]],
            description: [description, [
                Validators.typeAssert('string', description),
            ]],
            files: [files, [
                Validators.typeAssert('files', files),
            ]],
            tags: [tags, [
                Validators.typeAssert('string[]', tags),
            ]]
        };
    }

    static createOrUpdateReminder(name: string | null = null, date: string | null = null)
        : FormValidator {
        return {
            name: [name, [
                Validators.required,
                Validators.typeAssert('string', name),
            ]],
            date: [date, [
                Validators.required,
                Validators.typeAssert('string', date),
            ]],
        };
    }

    static createOrUpdateComment(description: string | null = null): FormValidator {
        return {
            description: [description, [
                Validators.required,
                Validators.typeAssert('string', description),
            ]]
        };
    }

    static updateNotificationPreferences(pushNotificationEnabled: NotificationType = null, emailEnabled: NotificationType = null,
        autoSubscribeToItem: NotificationType = null, pushNewComment: NotificationType = null, pushHot: NotificationType = null,
        emailNewComment: NotificationType = null, emailHot: NotificationType = null): FormValidator {
        return {
            pushNotificationEnabled: [pushNotificationEnabled, [
                Validators.required,
                Validators.typeAssert('boolean', pushNotificationEnabled),
            ]],
            emailEnabled: [emailEnabled, [
                Validators.required,
                Validators.typeAssert('boolean', emailEnabled),
            ]],
            autoSubscribeToItem: [autoSubscribeToItem, [
                Validators.required,
                Validators.typeAssert('boolean', autoSubscribeToItem),
            ]],
            pushNewComment: [pushNewComment, [
                Validators.required,
                Validators.typeAssert('boolean', pushNewComment),
            ]],
            pushHot: [pushHot, [
                Validators.required,
                Validators.typeAssert('boolean', pushHot),
            ]],
            emailNewComment: [emailNewComment, [
                Validators.required,
                Validators.typeAssert('boolean', emailNewComment),
            ]],
            emailHot: [emailHot, [
                Validators.required,
                Validators.typeAssert('boolean', emailHot),
            ]],
        };
    }

    static search(term: string | null = null): FormValidator {
        return {
            term: [term, [
                Validators.required,
                Validators.typeAssert('string', term),
            ]]
        };
    }

    static updateTwoFactorAuthentication(twoFactorAuthenticationEnabled: boolean | null = null): FormValidator {
        return {
            twoFactorAuthenticationEnabled: [twoFactorAuthenticationEnabled, [
                Validators.required,
                Validators.typeAssert('boolean', twoFactorAuthenticationEnabled),
            ]]
        };
    }

    static orderFavourite(newOrderVal: number | null = null, originalOrderVal: number | null = null): FormValidator {
        return {
            newOrderVal: [newOrderVal, [
                Validators.required,
                Validators.typeAssert('number', newOrderVal),
            ]],
            originalOrderVal: [originalOrderVal, [
                Validators.required,
                Validators.typeAssert('number', originalOrderVal),
            ]]
        };
    }

    static updateConfiguration(consent: boolean | null = null, darkTheme: boolean | null = null, language: string | null = null)
        : FormValidator {
        return {
            consent: [consent, [
                Validators.typeAssert('boolean', consent),
            ]],
            darkTheme: [darkTheme, [
                Validators.typeAssert('boolean', darkTheme),
            ]],
            language: [language, [
                Validators.typeAssert('string', language),
            ]],
        };
    }
}
