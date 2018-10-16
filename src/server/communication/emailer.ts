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

class Emailer implements Email {

    welcome(model: WelcomeEmailModel) {
        brokerManager.sendToQueue(QueueType.welcomeEmail, model);
    }

    forgotPassword(model: ForgotPasswordEmailModel) {
        brokerManager.sendToQueue(QueueType.forgotPasswordEmail, model);
    }

    feedback(model: FeedbackEmailModel) {
        brokerManager.sendToQueue(QueueType.feedbackEmail, model);
    }

    resendEmailVerificationLink(model: ResendEmailVerificationLinkEmailModel) {
        brokerManager.sendToQueue(QueueType.resendEmailVerificationLinkEmail, model);
    }

    paymentSuccessful(model: PaymentSuccessfulEmailModel) {
        brokerManager.sendToQueue(QueueType.paymentSuccessfulEmail, model);
    }

    passwordUpdated(model: PasswordUpdatedEmailModel) {
        brokerManager.sendToQueue(QueueType.passwordUpdatedEmail, model);
    }

    invite(model: InviteEmailModel) {
        brokerManager.sendToQueue(QueueType.inviteEmail, model);
    }

    notification(model: NotificationEmailModel) {
        brokerManager.sendToQueue(QueueType.notificationEmail, model);
    }
}

export const emailer = new Emailer();
