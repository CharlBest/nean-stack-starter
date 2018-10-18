import { FeedbackEmailModel } from '../models/email/feedback-email.model';
import { ForgotPasswordEmailModel } from '../models/email/forgot-password-email.model';
import { InviteEmailModel } from '../models/email/invite-email.model';
import { NotificationEmailModel } from '../models/email/notification-email.model';
import { PasswordUpdatedEmailModel } from '../models/email/password-updated-email.model';
import { PaymentSuccessfulEmailModel } from '../models/email/payment-successful-email.model';
import { ResendEmailVerificationLinkEmailModel } from '../models/email/resend-email-verification-link-email.model';
import { WelcomeEmailModel } from '../models/email/welcome-email.model';

export interface Email {
    welcome(model: WelcomeEmailModel): void;
    forgotPassword(model: ForgotPasswordEmailModel): void;
    feedback(model: FeedbackEmailModel): void;
    resendEmailVerificationLink(model: ResendEmailVerificationLinkEmailModel): void;
    paymentSuccessful(model: PaymentSuccessfulEmailModel): void;
    passwordUpdated(model: PasswordUpdatedEmailModel): void;
    invite(model: InviteEmailModel): void;
    notification(model: NotificationEmailModel): void;
    system(data: any): void;
}
