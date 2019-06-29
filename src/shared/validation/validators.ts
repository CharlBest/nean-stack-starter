import { Response } from 'express';
import { FormError, GlobalError } from '../models/shared/error.model';
import { AnyFormError, CustomFormValidator, Email, MinLength, Pattern, Required } from '../models/shared/form-error.model';
import { NotificationType } from '../models/user/user.model';

function isEmptyInputValue(value: any): boolean {
    // we don't check for string here so it also works with arrays
    return value === undefined || value === null || value.length === 0;
}

// tslint:disable-next-line:max-line-length
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
export const MAX_MEDIA_UPLOADS = 5;

const PASSWORD_REFEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]+$/;
const PASSWORD_LENGTH = 6;


// Source https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
export class Validators {
    private static nullValidator(c: AbstractControl): null { return null; }

    private static wrapControl(control: AbstractControl | object | string | number | null): AbstractControl {
        // Warning if this method starts allowing booleans
        return control && (control as any).value !== undefined ? control : { value: control } as any;
    }

    static required(control: AbstractControl | string | number | null): Required | null {
        control = Validators.wrapControl(control);
        return isEmptyInputValue(control.value) ? { required: true } : null;
    }

    static email(control: AbstractControl | string): Email | null {
        control = Validators.wrapControl(control);
        if (isEmptyInputValue(control.value)) {
            return null;  // don't validate empty values to allow optional controls
        }
        return EMAIL_REGEXP.test(control.value) ? null : { email: true };
    }

    static minLength(minLength: number): ValidatorFn {
        return (control: AbstractControl | any): MinLength | null => {
            control = Validators.wrapControl(control);
            if (isEmptyInputValue(control.value)) {
                return null;  // don't validate empty values to allow optional controls
            }
            const length: number = control.value ? control.value.length : 0;
            return length < minLength ?
                { minlength: { requiredLength: minLength, actualLength: length } } :
                null;
        };
    }

    static pattern(pattern: string | RegExp): ValidatorFn {
        if (!pattern) {
            return Validators.nullValidator;
        }
        let regex: RegExp;
        let regexStr: string;
        if (typeof pattern === 'string') {
            regexStr = '';

            if (pattern.charAt(0) !== '^') {
                regexStr += '^';
            }

            regexStr += pattern;

            if (pattern.charAt(pattern.length - 1) !== '$') {
                regexStr += '$';
            }

            regex = new RegExp(regexStr);
        } else {
            regexStr = pattern.toString();
            regex = pattern;
        }
        return (control: AbstractControl): Pattern | null => {
            if (isEmptyInputValue(control.value)) {
                return null;  // don't validate empty values to allow optional controls
            }
            const value: string = control.value;
            return regex.test(value) ? null :
                { pattern: { requiredPattern: regexStr, actualValue: value } };
        };
    }

    static customFormValidator(control: AbstractControl): CustomFormValidator | null {
        control = Validators.wrapControl(control);
        if (isEmptyInputValue(control.value)) {
            return null;  // don't validate empty values to allow optional controls
        }
        return control.value === '4' ? { customFormValidator: true } : null;
    }
}

export class BuildFormGroup {
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
                Validators.pattern(PASSWORD_REFEXP)
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

    static login(emailOrUsername: string | null = null, password: string | null = null): FormValidator {
        return {
            emailOrUsername: [emailOrUsername, [
                Validators.required
            ]],
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH)
            ]]
        };
    }

    static changeForgottenPassword(password: string | null = null): FormValidator {
        return {
            password: [password, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH),
                Validators.pattern(PASSWORD_REFEXP)
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
                Validators.pattern(PASSWORD_REFEXP)
            ]],
            confirmPassword: [confirmPassword, [
                Validators.required,
                Validators.minLength(PASSWORD_LENGTH)
            ]]
        };
    }

    static payment(amount: number | null = null, cardUId: string | null = null,
        saveCard: boolean | null = null, email: string | null = null): FormValidator {
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

    static updateNotificationPreferences(pushNotificationEnabled: NotificationType = null,
        emailEnabled: NotificationType = null, autoSubscribeToItem: NotificationType = null,
        pushNewComment: NotificationType = null, pushHot: NotificationType = null,
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
}

export class ServerValidator {
    static setErrorsAndSave(res: Response, formGroup: FormValidator): boolean {
        const validationErrors = [];
        for (const formField in formGroup) {
            if (formGroup.hasOwnProperty(formField)) {
                if (formGroup[formField] && formGroup[formField].length > 1) {
                    const errors = {};
                    const formFieldValue = formGroup[formField][0];
                    const formFieldValidators = formGroup[formField][1];

                    if (formFieldValidators) {
                        for (const formFieldValidator of formFieldValidators) {
                            const error = formFieldValidator(formFieldValue);
                            if (error) {
                                Object.assign(errors, error);
                            }
                        }
                    }

                    if (Object.keys(errors).length > 0) {
                        validationErrors.push({
                            field: formField,
                            errors
                        });
                    }
                }
            }
        }

        validationErrors.forEach((error) => {
            if (!res.locals.error) {
                res.locals.error = {} as any;
            }
            if (!res.locals.error.formErrors) {
                res.locals.error.formErrors = [];
            }
            const savedError = res.locals.error.formErrors.find((formError: FormError) => formError.field === error.field);
            if (savedError) {
                Object.assign(savedError.errors, error.errors);
            } else {
                res.locals.error.formErrors.push(error);
            }
        });

        return validationErrors.length > 0 ? true : false;
    }

    static addFormError(res: Response, field: string, error: AnyFormError | any | null): boolean {
        if (error) {
            if (!res.locals.error) {
                res.locals.error = {} as any;
            }
            if (!res.locals.error.formErrors) {
                res.locals.error.formErrors = [];
            }
            const savedError = res.locals.error.formErrors.find((formError: FormError) => formError.field === field);
            if (savedError) {
                Object.assign(savedError.errors, error);
            } else {
                res.locals.error.formErrors.push({
                    field,
                    errors: error
                });
            }
        }

        return error ? true : false;
    }

    static addGlobalError<T extends keyof GlobalError>(res: Response,
        field: T, error: null | GlobalError[T]): boolean {
        if (error) {
            if (!res.locals.error) {
                res.locals.error = {} as any;
            }
            if (!res.locals.error.globalErrors) {
                res.locals.error.globalErrors = {};
            }
            if (res.locals.error.globalErrors.hasOwnProperty(field)) {
                Object.assign(res.locals.error.globalErrors[field], error);
            } else {
                Object.assign(res.locals.error.globalErrors, {
                    [field]: error
                });
            }
        }

        return error ? true : false;
    }
}

interface FormValidator {
    [key: string]: [any, Array<ValidatorFn>?];
}

type ValidatorFn = (c: AbstractControl | string | number) => AnyFormError | null;

interface AbstractControl {
    value: any;
}
