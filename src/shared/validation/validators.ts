import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { Response } from 'express';

export class CustomValidators {

    private static wrapControl(control: AbstractControl | string | number): AbstractControl {
        return control instanceof AbstractControl ? control : <any>{ value: control };
    }

    static required(control: AbstractControl | string | number): ValidationErrors | null {
        return Validators.required(CustomValidators.wrapControl(control));
    }

    static email(control: AbstractControl | string | number): ValidationErrors | null {
        return Validators.email(CustomValidators.wrapControl(control));
    }

    static minLength(length: number): ValidatorFn {
        return (control: AbstractControl | string | number): ValidationErrors | null => {
            return Validators.minLength(length).call(this, CustomValidators.wrapControl(control));
        };
    }

    static is4(control: AbstractControl | string | number): ValidationErrors | null {
        return CustomValidators.wrapControl(control).value === '4' ? { is4: true } : null;
    }
}

export class BuildFormGroup {
    static createUser(email: string = null, username: string = null, password: string = null): FormValidator {
        return {
            email: [email, [
                CustomValidators.required,
                CustomValidators.email
            ]],
            username: [username, [
                CustomValidators.required
            ]],
            password: [password, [
                CustomValidators.required,
                CustomValidators.minLength(6)
            ]]
        };
    }

    static feedback(content: string = null): FormValidator {
        return {
            content: [content, [
                CustomValidators.required,
                CustomValidators.minLength(10)
            ]]
        };
    }

    static login(emailOrUsername: string = null, password: string = null): FormValidator {
        return {
            emailOrUsername: [emailOrUsername, [
                CustomValidators.required
            ]],
            password: [password, [
                CustomValidators.required,
                CustomValidators.minLength(6)
            ]]
        };
    }

    static changeForgottenPassword(password: string = null): FormValidator {
        return {
            password: [password, [
                CustomValidators.required,
                CustomValidators.minLength(6)
            ]]
        };
    }

    static forgotPassword(email: string = null): FormValidator {
        return {
            email: [email, [
                CustomValidators.required,
                CustomValidators.email
            ]]
        };
    }

    static updatePassword(password: string = null, newPassword: string = null, confirmPassword: string = null): FormValidator {
        return {
            password: [password, [
                CustomValidators.required,
                CustomValidators.minLength(6)
            ]],
            newPassword: [newPassword, [
                CustomValidators.required,
                CustomValidators.minLength(6)
            ]],
            confirmPassword: [confirmPassword, [
                CustomValidators.required,
                CustomValidators.minLength(6)
            ]]
        };
    }

    static payment(amount: number = null, cardUId: string = null, saveCard: boolean = null, email: string = null): FormValidator {
        return {
            amount: [amount, [
                CustomValidators.required
            ]],
            cardUId: [cardUId, []],
            saveCard: [saveCard, []],
            email: [email, []],
        };
    }

    static newsletter(email: string = null): FormValidator {
        return {
            email: [email, [
                CustomValidators.required,
                CustomValidators.email
            ]]
        };
    }

    static createItem(title: string = null, description: string = null): FormValidator {
        return {
            title: [title, [
                CustomValidators.required
            ]],
            description: [description, [
                CustomValidators.required
            ]]
        };
    }
}

export class ServerValidator {
    static setErrorsAndSave(res: Response, form: FormValidator) {
        const validationErrors = [];
        for (const field in form) {
            if (form.hasOwnProperty(field)) {
                if (form[field] !== undefined && form[field] !== null && form[field].length > 1) {
                    const errors = {};
                    for (let i = 0; i < form[field][1].length; i++) {
                        const error = form[field][1][i](form[field][0]);
                        if (error !== null) {
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
            if (res.locals.error === undefined) {
                res.locals.error = {};
            }
            if (res.locals.error.formErrors === undefined) {
                res.locals.error.formErrors = [];
            }
            const savedError = res.locals.error.formErrors.find(x => x.field === error.field);
            if (savedError !== undefined) {
                Object.assign(savedError.errors, error.errors);
            } else {
                res.locals.error.formErrors.push(error);
            }
        });

        return validationErrors.length > 0 ? true : false;
    }

    static addFormError(res: Response, field: string, error: Object) {
        if (error !== undefined && error !== null) {
            if (res.locals.error === undefined) {
                res.locals.error = {};
            }
            if (res.locals.error.formErrors === undefined) {
                res.locals.error.formErrors = [];
            }
            const savedError = res.locals.error.formErrors.find(x => x.field === field);
            if (savedError !== undefined) {
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

    static addGlobalError(res: Response, field: string, error: Object) {
        if (error !== undefined && error !== null) {
            if (res.locals.error === undefined) {
                res.locals.error = {};
            }
            if (res.locals.error.globalErrors === undefined) {
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
    if (string !== null && string !== undefined) {
        string = string.replace(/^\s+|\s+$/g, '');
        return string.replace(/^(&nbsp;)+|(&nbsp;)+$/g, '');
    } else {
        return string;
    }
}

interface FormValidator {
    [key: string]: [string | number | boolean, Array<Function>];
}

type ValidatorFn = (c: AbstractControl | string | number) => ValidationErrors | null;
