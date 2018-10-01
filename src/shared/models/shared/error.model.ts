import { ErrorEmail, ErrorRequired } from './form-error.model';

export interface ErrorModel {
    globalErrors: GlobalError;
    formErrors: Array<FormError>;
}

export interface FormError {
    field: string;
    errors: Object;
}

export interface GlobalError {
    // General
    inviteEmails?: ErrorRequired & ErrorEmail;

    // Payments
    anonymousPaymentToken?: ErrorRequired;
    userPaymentToken?: ErrorRequired;

    // Users
    createUserError?: boolean;
    changeForgottenPasswordEmail?: ErrorRequired & ErrorEmail;
    changeForgottenPasswordCode?: ErrorRequired;
    changeForgottenPasswordError?: boolean;
    forgotPasswordEmailNotFound?: boolean;
    loginInvalidCredentials?: boolean;
    updatePasswordInvalid?: boolean;
    updatePasswordError?: boolean;
    verifyEmailCode?: ErrorRequired;
}
