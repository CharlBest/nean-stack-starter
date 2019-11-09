import { Response } from 'express';
import { FormError, GlobalError } from '../models/shared/error.model';
import { FileModel } from '../models/shared/file.model';
// tslint:disable-next-line:max-line-length
import { AnyFormError, CustomFormValidator, Email, MinLength, PasswordCharacters, Pattern, Required, TypeAssert } from '../models/shared/form-error.model';
import { PasswordRegexBuilder } from './password-regex-builder';

function isEmptyInputValue(value: any): boolean {
    // we don't check for string here so it also works with arrays
    return value === undefined || value === null || value.length === 0;
}

// tslint:disable-next-line:max-line-length
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
export const MAX_FILE_UPLOADS = 5;

export const PASSWORD_LENGTH = 8;
export const PASSWORD_REGEX = new PasswordRegexBuilder(PASSWORD_LENGTH).oneUpperCase().oneLowerCase().oneDigit().value;

// Source https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
export class Validators {
    static required(control: AbstractControl | StringNumber | null): Required | null {
        control = Validators.wrapControl(control);
        return isEmptyInputValue(control.value) ? { required: true } : null;
    }

    static email(control: AbstractControl | StringNumber): Email | null {
        control = Validators.wrapControl(control);
        if (isEmptyInputValue(control.value)) {
            return null;  // don't validate empty values to allow optional controls
        }
        if (control.value) {
            control.value = control.value.toString();
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
        return (control: AbstractControl | StringNumber): Pattern | null => {
            if (isEmptyInputValue((control as AbstractControl).value)) {
                return null;  // don't validate empty values to allow optional controls
            }
            const value: string = (control as AbstractControl).value;
            return regex.test(value) ? null :
                { pattern: { requiredPattern: regexStr, actualValue: value } };
        };
    }

    static typeAssert(type: 'files', value?: object[] | null): ValidatorFn;
    static typeAssert(type: 'string', value?: string | null): ValidatorFn;
    static typeAssert(type: 'number', value?: number | null): ValidatorFn;
    static typeAssert(type: 'boolean', value?: boolean | null): ValidatorFn;
    static typeAssert(type: 'string[]', value?: Array<string> | null): ValidatorFn;
    static typeAssert(type: TypeAssertType, value: TypeAssertValue): ValidatorFn {
        return (control: AbstractControl | any): TypeAssert | null => {
            control = Validators.wrapControl(control);
            if (isEmptyInputValue(control.value)) {
                return null;  // don't validate empty values to allow optional controls
            }

            // Type Check
            let isValid = false;
            if (type === 'string' || type === 'number' || type === 'boolean') { // Primitives
                isValid = typeof control.value === type;
            } else if (type === 'files' && Array.isArray(control.value)) { // FileModel
                control.value.forEach((file: FileModel) => {
                    isValid = !Validators.hasFileError(file);
                });
            } else if (type.endsWith('[]') &&
                Array.isArray(control.value) &&
                (control.value.length === 0 ||
                    (control.value.length > 0 &&
                        (control.value as string[]).every(arrayItem => typeof arrayItem === type.replace('[]', ''))))) { // Array primitives
                isValid = true;
            }
            return isValid ? null : { typeAssert: true };
        };
    }

    static passwordCharacters(control: AbstractControl | string): PasswordCharacters | null {
        control = Validators.wrapControl(control);
        if (isEmptyInputValue(control.value)) {
            return null;  // don't validate empty values to allow optional controls
        }

        const hasCapitalLetter = new PasswordRegexBuilder().oneUpperCase().value.test(control.value);
        const hasLowercaseLetter = new PasswordRegexBuilder().oneLowerCase().value.test(control.value);
        const hasNumber = new PasswordRegexBuilder().oneDigit().value.test(control.value);
        // Optional: const hasSpecialCharacter = new PasswordRegexBuilder().oneSpecialCharacter().value.test(control.value);

        if (hasCapitalLetter && hasLowercaseLetter && hasNumber) {
            return null;
        } else {
            // Return true if invalid/error
            return {
                passwordCharacters: {
                    capital: !hasCapitalLetter,
                    lowercase: !hasLowercaseLetter,
                    number: !hasNumber,
                    special: false,
                }
            };
        }
    }

    static customFormValidator(control: AbstractControl): CustomFormValidator | null {
        control = Validators.wrapControl(control);
        if (isEmptyInputValue(control.value)) {
            return null;  // don't validate empty values to allow optional controls
        }
        return control.value === '4' ? { customFormValidator: true } : null;
    }

    private static nullValidator(c: AbstractControl | StringNumber): null { return null; }

    private static wrapControl(control: WrapControlType): AbstractControl {
        // Warning if this method starts allowing booleans
        return control && (control as any).value !== undefined ? control : { value: control } as any;
    }

    private static hasFileError(file: FileModel): boolean {
        // TODO: this is ugly!
        return typeof file !== 'object' ||
            !!Validators.required(file.url) ||
            !!Validators.typeAssert('string', file.url)(file.url) ||
            !!Validators.typeAssert('number', file.width)(file.width as number) ||
            !!Validators.typeAssert('number', file.height)(file.height as number) ||
            !!Validators.typeAssert('number', file.aspectRatio)(file.aspectRatio as number) ||
            !!Validators.required(file.exifOrientation) ||
            !!Validators.typeAssert('number', file.exifOrientation)(file.exifOrientation as number) ||
            !!Validators.typeAssert('number', file.rotation)(file.rotation as number);
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

// TODO: these types are getting out of hand. Refactor!

type ValidatorFn = (c: AbstractControl | string | number) => AnyFormError | null;
type WrapControlType = AbstractControl | object | StringNumber | null | undefined;
type StringNumber = string | number;

type TypeAssertValue = null | undefined | string | number | boolean | Array<string> | object[];
type TypeAssertPrimitive = 'string' | 'number' | 'boolean';
type TypeAssertType = TypeAssertPrimitive | 'string[]' | 'files';

interface AbstractControl {
    value: any;
}
