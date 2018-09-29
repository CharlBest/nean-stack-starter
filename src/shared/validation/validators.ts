import { Response } from 'express';
import { FormError, GlobalError } from '../models/shared/error.model';
import { AnyFormError, ErrorCustomFormValidator, ErrorEmail, ErrorMinLength, ErrorPattern, ErrorRequired } from '../models/shared/form-error.model';

function isEmptyInputValue(value: any): boolean {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0;
}

// tslint:disable-next-line:max-line-length
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
export const MAX_MEDIA_UPLOADS = 5;

const PASSWORD_REFEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]+$/;
const PASSWORD_LENGTH = 6;


// Source https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
export class Validators {
    private static nullValidator(c: AbstractControl): null { return null; }

    private static wrapControl(control: AbstractControl | Object | string | number | null): AbstractControl {
        // Warning if this method starts allowing booleans
        return control && (<any>control).value !== undefined ? control : <any>{ value: control };
    }

    static required(control: AbstractControl | string | number | null): ErrorRequired | null {
        control = Validators.wrapControl(control);
        return isEmptyInputValue(control.value) ? { required: true } : null;
    }

    static email(control: AbstractControl | string): ErrorEmail | null {
        control = Validators.wrapControl(control);
        if (isEmptyInputValue(control.value)) {
            return null;  // don't validate empty values to allow optional controls
        }
        return EMAIL_REGEXP.test(control.value) ? null : { email: true };
    }

    static minLength(minLength: number): ValidatorFn {
        return (control: AbstractControl | any): ErrorMinLength | null => {
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
        return (control: AbstractControl): ErrorPattern | null => {
            if (isEmptyInputValue(control.value)) {
                return null;  // don't validate empty values to allow optional controls
            }
            const value: string = control.value;
            return regex.test(value) ? null :
                { pattern: { requiredPattern: regexStr, actualValue: value } };
        };
    }

    static customFormValidator(control: AbstractControl): ErrorCustomFormValidator | null {
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
            description: [description, [
                Validators.required
            ]],
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
}

export class ServerValidator {
    static setErrorsAndSave(res: Response, form: FormValidator): boolean {
        const validationErrors = [];
        for (const field in form) {
            if (form.hasOwnProperty(field)) {
                if (form[field] && form[field].length > 1) {
                    const errors = {};
                    for (let i = 0; i < form[field][1].length; i++) {
                        const error = form[field][1][i](form[field][0]);
                        if (error) {
                            Object.assign(errors, error);
                        }
                    }

                    if (Object.keys(errors).length > 0) {
                        validationErrors.push({
                            field,
                            errors
                        });
                    }
                }
            }
        }
        validationErrors.forEach((error) => {
            if (!res.locals.error) {
                res.locals.error = <any>{};
            }
            if (!res.locals.error.formErrors) {
                res.locals.error.formErrors = [];
            }
            const savedError = res.locals.error.formErrors.find((x: FormError) => x.field === error.field);
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
                res.locals.error = <any>{};
            }
            if (!res.locals.error.formErrors) {
                res.locals.error.formErrors = [];
            }
            const savedError = res.locals.error.formErrors.find((x: FormError) => x.field === field);
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
                res.locals.error = <any>{};
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
    [key: string]: any;
}

type ValidatorFn = (c: AbstractControl | string | number) => AnyFormError | null;

abstract class AbstractControl {
    value: any;
}
