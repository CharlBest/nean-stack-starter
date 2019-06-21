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
    createUser?: boolean;
    changeForgottenPasswordEmail?: ErrorRequired & ErrorEmail;
    changeForgottenPasswordCode?: ErrorRequired;
    changeForgottenPassword?: boolean;
    forgotPasswordEmailNotFound?: boolean;
    loginInvalidCredentials?: boolean;
    updatePasswordInvalid?: boolean;
    updatePassword?: boolean;
    verifyEmailCode?: ErrorRequired;
}
