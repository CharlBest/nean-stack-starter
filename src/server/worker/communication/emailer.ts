import { MailData } from '@sendgrid/helpers/classes/mail';
import * as sendGridMail from '@sendgrid/mail';
import { Email } from '../../communication/interfaces/email.interface';
import { FeedbackCommunicationModel } from '../../communication/models/feedback-communication.model';
import { ForgotPasswordCommunicationModel } from '../../communication/models/forgot-password-communication.model';
import { InviteCommunicationModel } from '../../communication/models/invite-communication.model';
import { NotificationCommunicationModel } from '../../communication/models/notification-communication.model';
import { PasswordUpdatedCommunicationModel } from '../../communication/models/password-updated-communication.model';
import { PaymentSuccessfulCommunicationModel } from '../../communication/models/payment-successful-communication.model';
import { ResendEmailVerificationLinkCommunicationModel } from '../../communication/models/resend-email-verification-link-communication.model';
// import { logger } from '../core/utils/logger';
import { WelcomeCommunicationModel } from '../../communication/models/welcome-communication.model';
import { environment } from '../../environments/environment';

sendGridMail.setApiKey(environment.sendGrid.apiKey);
sendGridMail.setSubstitutionWrappers('{{', '}}');

class Emailer implements Email {
    fromEmail = 'admin@nean.io';
    fromName = 'NEAN';

    welcome(model: WelcomeCommunicationModel) {
        const data: MailData = {
            to: model.email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.welcome,
        };

        // TODO: fix sendgrid bug with declaring substitution variables
        // html: {{username}}
        // url: /verify/{{emailVerifyCode}}
        data['dynamic_template_data'] = {
            subject: 'Welcome',
            username: model.username,
            emailVerifyCode: model.emailVerifyCode,
        };

        this.send(data);
    }

    forgotPassword(model: ForgotPasswordCommunicationModel) {
        const data: MailData = {
            to: model.email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.forgotPassword,
        };

        // url: /forgot-password/reset?code={{forgotPasswordCode}}&email={{email}}
        data['dynamic_template_data'] = {
            subject: 'Forgot Password',
            email: model.email,
            forgotPasswordCode: model.forgotPasswordCode,
        };

        this.send(data);
    }

    feedback(model: FeedbackCommunicationModel) {
        const data: MailData = {
            to: this.fromEmail,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.feedback,
        };

        // html: {{feedbackContent}}
        data['dynamic_template_data'] = {
            subject: 'Feedback',
            feedbackContent: model.feedbackContent,
        };

        this.send(data);
    }

    resendEmailVerificationLink(model: ResendEmailVerificationLinkCommunicationModel) {
        const data: MailData = {
            to: model.email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.resendEmailVerificationLink,
        };

        // url: /verify/{{emailVerifyCode}}
        data['dynamic_template_data'] = {
            subject: 'Email verification',
            emailVerifyCode: model.emailVerifyCode,
        };

        this.send(data);
    }

    paymentSuccessful(model: PaymentSuccessfulCommunicationModel) {
        const data: MailData = {
            to: model.email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.paymentSuccessful,
        };

        // html: {{amount}}
        data['dynamic_template_data'] = {
            subject: 'Payment Successful',
            amount: model.amount,
        };

        this.send(data);
    }

    passwordUpdated(model: PasswordUpdatedCommunicationModel) {
        const data: MailData = {
            to: model.email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.passwordUpdated,
        };

        // html: {{email}}
        data['dynamic_template_data'] = {
            subject: 'Password Updated',
        };

        this.send(data);
    }

    invite(model: InviteCommunicationModel) {
        const data: MailData = {
            to: model.emails,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.invite,
            isMultiple: true,
        };

        data['dynamic_template_data'] = {
            subject: 'Invite',
        };

        this.send(data);
    }

    notification(model: NotificationCommunicationModel) {
        const data: MailData = {
            to: model.email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.notification,
        };

        data['dynamic_template_data'] = {
            subject: 'Notification',
            title: model.title,
            body: model.body
        };

        this.send(data);
    }

    send(data: MailData) {
        if (!environment.production) {
            data.mailSettings = {
                sandboxMode: {
                    enable: true
                }
            };
        }

        if (environment.production) {
            sendGridMail.send(data, undefined, (err: Error) => {
                if (err) {
                    // logger.error(err);
                    throw err;
                    // TODO: save against profile that email failed to send (maybe)
                }
            });
        }
    }
}

export const emailer = new Emailer();
