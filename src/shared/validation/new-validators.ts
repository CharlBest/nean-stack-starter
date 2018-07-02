import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

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
    static login(emailOrUsername: string = null, password: string = null): FormValidator {
        return {
            emailOrUsername: [emailOrUsername, [
                ClientValidators.required,
            ]],
            password: [password, [
                ClientValidators.required,
                ClientValidators.minLength(6)
            ]]
        };
    }
}

export class ServerValidator {
    static getErrors(form: FormValidator) {
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
        return validationErrors.length > 0 ? validationErrors : null;
    }
}

interface FormValidator {
    [key: string]: [string, Array<Function>];
}
