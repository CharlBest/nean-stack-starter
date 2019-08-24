export type AnyFormError =
    Required |
    Email |
    MinLength |
    Pattern |
    TypeAssert |
    PasswordCharacters |
    CustomFormValidator;

export interface Required {
    required?: boolean;
}

export interface Email {
    email?: boolean;
}

export interface MinLength {
    minlength: {
        requiredLength: number,
        actualLength: number
    };
}

export interface Pattern {
    pattern: {
        requiredPattern: string,
        actualValue: string
    };
}

export interface TypeAssert {
    typeAssert: boolean;
}

export interface PasswordCharacters {
    passwordCharacters: {
        capital: boolean;
        lowercase: boolean;
        number: boolean;
        special: boolean;
    };
}

export interface CustomFormValidator {
    customFormValidator: boolean;
}
