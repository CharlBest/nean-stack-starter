import { brokerManager } from '../broker/broker-manager';
import { QueueType } from '../broker/queue-type.enum';
import { Email } from './interfaces/email.interface';
import { FeedbackEmailModel } from './models/email/feedback-email.model';
import { ForgotPasswordEmailModel } from './models/email/forgot-password-email.model';
import { InviteEmailModel } from './models/email/invite-email.model';
import { NotificationEmailModel } from './models/email/notification-email.model';
import { PasswordUpdatedEmailModel } from './models/email/password-updated-email.model';
import { PaymentSuccessfulEmailModel } from './models/email/payment-successful-email.model';
import { ResendEmailVerificationLinkEmailModel } from './models/email/resend-email-verification-link-email.model';
import { WelcomeEmailModel } from './models/email/welcome-email.model';

class EmailBroker implements Email {

    welcome(model: WelcomeEmailModel): void {
        brokerManager.sendToQueue(QueueType.WELCOME_EMAIL, model);
    }

    forgotPassword(model: ForgotPasswordEmailModel): void {
        brokerManager.sendToQueue(QueueType.FORGOT_PASSWORD_EMAIL, model);
    }

    feedback(model: FeedbackEmailModel): void {
        brokerManager.sendToQueue(QueueType.FEEDBACK_EMAIL, model);
    }

    resendEmailVerificationLink(model: ResendEmailVerificationLinkEmailModel): void {
        brokerManager.sendToQueue(QueueType.RESEND_EMAIL_VERIFICATION_LINK_EMAIL, model);
    }

    paymentSuccessful(model: PaymentSuccessfulEmailModel): void {
        brokerManager.sendToQueue(QueueType.PAYMENT_SUCCESSFUL_EMAIL, model);
    }

    passwordUpdated(model: PasswordUpdatedEmailModel): void {
        brokerManager.sendToQueue(QueueType.PASSWORD_UPDATED_EMAIL, model);
    }

    invite(model: InviteEmailModel): void {
        brokerManager.sendToQueue(QueueType.INVITE_EMAIL, model);
    }

    notification(model: NotificationEmailModel): void {
        brokerManager.sendToQueue(QueueType.NOTIFICATION_EMAIL, model);
    }

    system(data: any): void {
        brokerManager.sendToQueue(QueueType.SYSTEM_EMAIL, data);
    }
}

export const emailBroker = new EmailBroker();
