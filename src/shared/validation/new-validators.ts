import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Response } from 'express';

export const GLOBAL_ERROR_KEY = 'globalErrors';

class ClientValidators {

    private static wrapControl(control: AbstractControl | string | number): AbstractControl {
        return control instanceof AbstractControl ? control : <any>{ value: control };
    }

    static required(control: AbstractControl | string | number): ValidationErrors | null {
        return Validators.required(ClientValidators.wrapControl(control));
    }

    static email(control: AbstractControl | string | number): ValidationErrors | null {
        return Validators.email(ClientValidators.wrapControl(control));
    }

    static minLength(length: number): ValidatorFn {
        return (control: AbstractControl | string | number): ValidationErrors | null => {
            return Validators.minLength(length).call(this, ClientValidators.wrapControl(control));
        };
    }

    static is4(control: AbstractControl | string | number): ValidationErrors | null {
        return ClientValidators.wrapControl(control).value === '4' ? { is4: true } : null;
    }
}

export class BuildFormGroup {
    static createUser(email: string = null, username: string = null, password: string = null): FormValidator {
        return {
            email: [email, [
                ClientValidators.required,
                ClientValidators.email
            ]],
            username: [username, [
                ClientValidators.required
            ]],
            password: [password, [
                ClientValidators.required,
                ClientValidators.minLength(6)
            ]]
        };
    }
    static login(emailOrUsername: string = null, password: string = null): FormValidator {
        return {
            emailOrUsername: [emailOrUsername, [
                ClientValidators.required
            ]],
            password: [password, [
                ClientValidators.required,
                ClientValidators.minLength(6)
            ]]
        };
    }
}

export class ServerValidator {
    static getErrorsAndSave(res: Response, form: FormValidator) {
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

    static addGlobalError(res: Response, field: string, error: Object) {
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
}

interface FormValidator {
    [key: string]: [string, Array<Function>];
}
