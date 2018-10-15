import { broker } from '../broker/broker';
import { Email } from './interfaces/email.interface';
import { FeedbackCommunicationModel } from './models/feedback-communication.model';
import { ForgotPasswordCommunicationModel } from './models/forgot-password-communication.model';
import { InviteCommunicationModel } from './models/invite-communication.model';
import { NotificationCommunicationModel } from './models/notification-communication.model';
import { PasswordUpdatedCommunicationModel } from './models/password-updated-communication.model';
import { PaymentSuccessfulCommunicationModel } from './models/payment-successful-communication.model';
import { ResendEmailVerificationLinkCommunicationModel } from './models/resend-email-verification-link-communication.model';
import { WelcomeCommunicationModel } from './models/welcome-communication.model';

class Emailer implements Email {

    welcome(model: WelcomeCommunicationModel) {
        broker.sendToQueue(model);
    }

    forgotPassword(model: ForgotPasswordCommunicationModel) {
        broker.sendToQueue(model);
    }

    feedback(model: FeedbackCommunicationModel) {
        broker.sendToQueue(model);
    }

    resendEmailVerificationLink(model: ResendEmailVerificationLinkCommunicationModel) {
        broker.sendToQueue(model);
    }

    paymentSuccessful(model: PaymentSuccessfulCommunicationModel) {
        broker.sendToQueue(model);
    }

    passwordUpdated(model: PasswordUpdatedCommunicationModel) {
        broker.sendToQueue(model);
    }

    invite(model: InviteCommunicationModel) {
        broker.sendToQueue(model);
    }

    notification(model: NotificationCommunicationModel) {
        broker.sendToQueue(model);
    }
}

export const emailer = new Emailer();
