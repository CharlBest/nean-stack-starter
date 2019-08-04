import { Response } from 'express';
import { FormError, GlobalError } from '../models/shared/error.model';
import { AnyFormError, CustomFormValidator, Email, MinLength, Pattern, Required } from '../models/shared/form-error.model';
import { PasswordRegexBuilder } from './password-regex-builder';

function isEmptyInputValue(value: any): boolean {
    // we don't check for string here so it also works with arrays
    return value === undefined || value === null || value.length === 0;
}

// tslint:disable-next-line:max-line-length
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
export const MAX_MEDIA_UPLOADS = 5;

export const PASSWORD_LENGTH = 8;
export const PASSWORD_REGEX = new PasswordRegexBuilder(PASSWORD_LENGTH).oneUpperCase().oneLowerCase().oneDigit().value;

// Source https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
export class Validators {
    private static nullValidator(c: AbstractControl): null { return null; }

    private static wrapControl(control: WrapControlType): AbstractControl {
        // Warning if this method starts allowing booleans
        return control && (control as any).value !== undefined ? control : { value: control } as any;
    }

    static required(control: AbstractControl | StringNumber | null): Required | null {
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

export class ServerValidator {

    private static executeFormControlValidator(formGroup: FormValidator, formField: string) {
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
            return {
                field: formField,
                errors
            };
        } else {
            return null;
        }
    }

    static setErrorsAndSave(res: Response, formGroup: FormValidator): boolean {
        const validationErrors: FormError[] = [];

        for (const formField in formGroup) {
            if (formGroup.hasOwnProperty(formField) && formGroup[formField] && formGroup[formField].length > 1) {
                const error = ServerValidator.executeFormControlValidator(formGroup, formField);
                if (error) {
                    validationErrors.push(error);
                }
            }
        }

        // Set form errors
        validationErrors.forEach((error) => this.addFormError(res, error.field, error.errors));

        return validationErrors.length > 0;
    }

    static addFormError(res: Response, field: string, error: AnyFormError | any | null): boolean {
        if (error) {
            if (!res.locals.error) {
                res.locals.error = {
                    globalErrors: {},
                    formErrors: []
                };
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

        return !!error;
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

        return !!error;
    }
}

export interface FormValidator {
    [key: string]: [any, Array<ValidatorFn>?];
}

type ValidatorFn = (c: AbstractControl | string | number) => AnyFormError | null;
type WrapControlType = AbstractControl | object | StringNumber | null;
type StringNumber = string | number;

interface AbstractControl {
    value: any;
}
