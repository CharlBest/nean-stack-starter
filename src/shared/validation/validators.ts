import { Response } from 'express';

function isEmptyInputValue(value: any): boolean {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0;
}

const EMAIL_REGEXP =
    /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

// Source https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
export class Validators {
    private static wrapControl(control: AbstractControl | string | number): AbstractControl {
        // Warning if this method starts allowing booleans
        return control && (<any>control).value !== undefined ? control : <any>{ value: control };
    }

    static required(control: AbstractControl | any): ValidationErrors | null {
        control = Validators.wrapControl(control);
        return isEmptyInputValue(control.value) ? { 'required': true } : null;
    }

    static email(control: AbstractControl | any): ValidationErrors | null {
        control = Validators.wrapControl(control);
        if (isEmptyInputValue(control.value)) {
            return null;  // don't validate empty values to allow optional controls
        }
        return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
    }

    static minLength(minLength: number): ValidatorFn {
        return (control: AbstractControl | any): ValidationErrors | null => {
            control = Validators.wrapControl(control);
            if (isEmptyInputValue(control.value)) {
                return null;  // don't validate empty values to allow optional controls
            }
            const length: number = control.value ? control.value.length : 0;
            return length < minLength ?
                { 'minlength': { 'requiredLength': minLength, 'actualLength': length } } :
                null;
        };
    }

    static is4(control: AbstractControl): ValidationErrors | null {
        control = Validators.wrapControl(control);
        if (isEmptyInputValue(control.value)) {
            return null;  // don't validate empty values to allow optional controls
        }
        return control.value === '4' ? { 'is4': true } : null;
    }
}

export class BuildFormGroup {
    static createUser(email: string = null, username: string = null, password: string = null): FormValidator {
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
                Validators.minLength(6)
            ]]
        };
    }

    static feedback(content: string = null): FormValidator {
        return {
            content: [content, [
                Validators.required,
                Validators.minLength(10)
            ]]
        };
    }

    static login(emailOrUsername: string = null, password: string = null): FormValidator {
        return {
            emailOrUsername: [emailOrUsername, [
                Validators.required
            ]],
            password: [password, [
                Validators.required,
                Validators.minLength(6)
            ]]
        };
    }

    static changeForgottenPassword(password: string = null): FormValidator {
        return {
            password: [password, [
                Validators.required,
                Validators.minLength(6)
            ]]
        };
    }

    static forgotPassword(email: string = null): FormValidator {
        return {
            email: [email, [
                Validators.required,
                Validators.email
            ]]
        };
    }

    static updatePassword(password: string = null, newPassword: string = null, confirmPassword: string = null): FormValidator {
        return {
            password: [password, [
                Validators.required,
                Validators.minLength(6)
            ]],
            newPassword: [newPassword, [
                Validators.required,
                Validators.minLength(6)
            ]],
            confirmPassword: [confirmPassword, [
                Validators.required,
                Validators.minLength(6)
            ]]
        };
    }

    static payment(amount: number = null, cardUId: string = null, saveCard: boolean = null, email: string = null): FormValidator {
        return {
            amount: [amount, [
                Validators.required
            ]],
            cardUId: [cardUId, []],
            saveCard: [saveCard, []],
            email: [email, []],
        };
    }

    static newsletter(email: string = null): FormValidator {
        return {
            email: [email, [
                Validators.required,
                Validators.email
            ]]
        };
    }

    static createOrUpdateItem(title: string = null, description: string = null, media: Array<string> = null): FormValidator {
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
            const savedError = res.locals.error.formErrors.find(x => x.field === error.field);
            if (savedError) {
                Object.assign(savedError.errors, error.errors);
            } else {
                res.locals.error.formErrors.push(error);
            }
        });

        return validationErrors.length > 0 ? true : false;
    }

    static addFormError(res: Response, field: string, error: Object): boolean {
        if (error) {
            if (!res.locals.error) {
                res.locals.error = <any>{};
            }
            if (!res.locals.error.formErrors) {
                res.locals.error.formErrors = [];
            }
            const savedError = res.locals.error.formErrors.find(x => x.field === field);
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

    static addGlobalError(res: Response, field: string, error: Object): boolean {
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

export function trimString(string: string): string {
    if (string) {
        string = string.replace(/^\s+|\s+$/g, '');
        return string.replace(/^(&nbsp;)+|(&nbsp;)+$/g, '');
    } else {
        return string;
    }
}

interface FormValidator {
    [key: string]: any;
}

type ValidatorFn = (c: AbstractControl | string | number) => ValidationErrors | null;

interface ValidationErrors {
    [key: string]: any;
}

abstract class AbstractControl {
    value: any;
}
