import { FeedbackCommunicationModel } from '../models/feedback-communication.model';
import { ForgotPasswordCommunicationModel } from '../models/forgot-password-communication.model';
import { InviteCommunicationModel } from '../models/invite-communication.model';
import { NotificationCommunicationModel } from '../models/notification-communication.model';
import { PasswordUpdatedCommunicationModel } from '../models/password-updated-communication.model';
import { PaymentSuccessfulCommunicationModel } from '../models/payment-successful-communication.model';
import { ResendEmailVerificationLinkCommunicationModel } from '../models/resend-email-verification-link-communication.model';
import { WelcomeCommunicationModel } from '../models/welcome-communication.model';

export interface Email {
    welcome(model: WelcomeCommunicationModel): void;

    forgotPassword(model: ForgotPasswordCommunicationModel): void;

    feedback(model: FeedbackCommunicationModel): void;

    resendEmailVerificationLink(model: ResendEmailVerificationLinkCommunicationModel): void;

    paymentSuccessful(model: PaymentSuccessfulCommunicationModel): void;

    passwordUpdated(model: PasswordUpdatedCommunicationModel): void;

    invite(model: InviteCommunicationModel): void;

    notification(model: NotificationCommunicationModel): void;
}
