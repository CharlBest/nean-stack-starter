import { MailData } from '@sendgrid/helpers/classes/mail';
import * as sendGridMail from '@sendgrid/mail';
import { Email } from '../../communication/interfaces/email.interface';
import { FeedbackEmailModel } from '../../communication/models/email/feedback-email.model';
import { ForgotPasswordEmailModel } from '../../communication/models/email/forgot-password-email.model';
import { InviteEmailModel } from '../../communication/models/email/invite-email.model';
import { NotificationEmailModel } from '../../communication/models/email/notification-email.model';
import { PasswordUpdatedEmailModel } from '../../communication/models/email/password-updated-email.model';
import { PaymentSuccessfulEmailModel } from '../../communication/models/email/payment-successful-email.model';
import { ResendEmailVerificationLinkEmailModel } from '../../communication/models/email/resend-email-verification-link-email.model';
import { WelcomeEmailModel } from '../../communication/models/email/welcome-email.model';
import { environment } from '../../environments/environment';
// import { logger } from '../core/utils/logger';

sendGridMail.setApiKey(environment.sendGrid.apiKey);
sendGridMail.setSubstitutionWrappers('{{', '}}');

class Emailer implements Email {
    fromEmail = 'admin@nean.io';
    fromName = 'NEAN';

    welcome(model: WelcomeEmailModel) {
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

    forgotPassword(model: ForgotPasswordEmailModel) {
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

    feedback(model: FeedbackEmailModel) {
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

    resendEmailVerificationLink(model: ResendEmailVerificationLinkEmailModel) {
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

    paymentSuccessful(model: PaymentSuccessfulEmailModel) {
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

    passwordUpdated(model: PasswordUpdatedEmailModel) {
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

    invite(model: InviteEmailModel) {
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

    notification(model: NotificationEmailModel) {
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
