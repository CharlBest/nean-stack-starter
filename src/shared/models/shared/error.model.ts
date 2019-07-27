import { Email, Required } from './form-error.model';

export interface ErrorModel {
    globalErrors: GlobalError;
    formErrors: Array<FormError>;
}

export interface FormError {
    field: string;
    errors: object;
}

export interface GlobalError {
    // General
    inviteEmails?: Required & Email;

    // Payments
    anonymousPaymentToken?: Required;
    userPaymentToken?: Required;

    // Users
    createUser?: boolean;
    changeForgottenPasswordEmail?: Required & Email;
    changeForgottenPasswordCode?: Required;
    changeForgottenPassword?: boolean;
    forgotPasswordEmailNotFound?: boolean;
    loginInvalidCredentials?: boolean;
    updatePasswordInvalid?: boolean;
    updatePassword?: boolean;
    verifyEmailCode?: Required;
    updateTwoFactorAuthentication?: boolean;
}
