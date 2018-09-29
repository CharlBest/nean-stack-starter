export type AnyFormError =
    ErrorRequired |
    ErrorEmail |
    ErrorMinLength |
    ErrorPattern |
    ErrorCustomFormValidator;

export interface ErrorRequired {
    required?: boolean;
}

export interface ErrorEmail {
    email?: boolean;
}

export interface ErrorMinLength {
    minlength: {
        requiredLength: number,
        actualLength: number
    };
}

export interface ErrorPattern {
    pattern: {
        requiredPattern: string,
        actualValue: string
    };
}

export interface ErrorCustomFormValidator {
    customFormValidator: boolean;
}
