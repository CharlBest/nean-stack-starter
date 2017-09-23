export enum ErrorMessageType {
    email,
    required,
    minLength,
    maxLength
}

export class Validators {

    // TODO: max, maxLength, pattern
    private static readonly errorMessages = {
        [ErrorMessageType[ErrorMessageType.required]]: () => 'This field is required',
        [ErrorMessageType[ErrorMessageType.email]]: () => 'Email is invalid',
        [ErrorMessageType[ErrorMessageType.minLength]]: (minLength) => 'The min number of characters is ' + minLength,
        [ErrorMessageType[ErrorMessageType.maxLength]]: (maxLength) => 'The max allowed number of characters is ' + maxLength,
        // 'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
        // 'years': (params) => params.message,
        // 'countryCity': (params) => params.message,
        // 'uniqueName': (params) => params.message,
        // 'telephoneNumbers': (params) => params.message,
        // 'telephoneNumber': (params) => params.message
    }

    public static getMessage(type: string, params: any) {
        return Validators.errorMessages[type](params);
    }

    private static getServerErrorMessage(type: ErrorMessageType, params: any) {
        return {
            [ErrorMessageType[type]]: {
                message: Validators.getMessage(ErrorMessageType[type], params)
            }
        }
    }

    static email(control: AbstractControl): ValidationErrors {
        const isValidEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(control.value);
        return isValidEmail ? null : Validators.getServerErrorMessage(ErrorMessageType.email, null);
    }

    static required(control: AbstractControl): ValidationErrors {
        // TODO: check html whitespace
        const valueWithoutWhitespace = control.value.replace(/\s+/g, '');
        if (valueWithoutWhitespace !== null && valueWithoutWhitespace !== undefined && valueWithoutWhitespace !== '') {
            return null;
        } else {
            return Validators.getServerErrorMessage(ErrorMessageType.required, null)
        }
    }

    static minLength(minLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors => {
            if (control.value.length >= minLength) {
                return null;
            } else {
                return Validators.getServerErrorMessage(ErrorMessageType.minLength, minLength)
            }
        }
    }

    static maxLength(maxLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors => {
            if (control.value.length < maxLength) {
                return null;
            } else {
                return Validators.getServerErrorMessage(ErrorMessageType.maxLength, maxLength)
            }
        }
    }
}

interface AbstractControl {
    value: any;
}

type ValidatorFn = (c: AbstractControl) => ValidationErrors | null;

interface ValidationErrors {
    [key: string]: any;
}
