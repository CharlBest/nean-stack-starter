import { broker } from '../broker/broker';
import { Email } from './interfaces/email.interface';
import { FeedbackEmailModel } from './models/email/feedback-email.model';
import { ForgotPasswordEmailModel } from './models/email/forgot-password-email.model';
import { InviteEmailModel } from './models/email/invite-email.model';
import { NotificationEmailModel } from './models/email/notification-email.model';
import { PasswordUpdatedEmailModel } from './models/email/password-updated-email.model';
import { PaymentSuccessfulEmailModel } from './models/email/payment-successful-email.model';
import { ResendEmailVerificationLinkEmailModel } from './models/email/resend-email-verification-link-email.model';
import { WelcomeEmailModel } from './models/email/welcome-email.model';

class Emailer implements Email {

    welcome(model: WelcomeEmailModel) {
        broker.sendToQueue(model);
    }

    forgotPassword(model: ForgotPasswordEmailModel) {
        broker.sendToQueue(model);
    }

    feedback(model: FeedbackEmailModel) {
        broker.sendToQueue(model);
    }

    resendEmailVerificationLink(model: ResendEmailVerificationLinkEmailModel) {
        broker.sendToQueue(model);
    }

    paymentSuccessful(model: PaymentSuccessfulEmailModel) {
        broker.sendToQueue(model);
    }

    passwordUpdated(model: PasswordUpdatedEmailModel) {
        broker.sendToQueue(model);
    }

    invite(model: InviteEmailModel) {
        broker.sendToQueue(model);
    }

    notification(model: NotificationEmailModel) {
        broker.sendToQueue(model);
    }
}

export const emailer = new Emailer();
