export interface ErrorModel {
    globalErrors: GlobalError;
    formErrors: Array<FormError>;
}

export interface FormError {
    field: string;
    errors: Object;
}

export interface GlobalError {
    [key: string]: string;
}
