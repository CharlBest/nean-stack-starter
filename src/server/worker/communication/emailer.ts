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

    async welcome(model: WelcomeEmailModel): Promise<boolean> {
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
        data.dynamicTemplateData = {
            subject: 'Welcome',
            username: model.username,
            emailVerifyCode: model.verifyCode,
        };

        return this.send(data);
    }

    async forgotPassword(model: ForgotPasswordEmailModel): Promise<boolean> {
        const data: MailData = {
            to: model.email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.forgotPassword,
        };

        // url: /forgot-password/reset?code={{verifyCode}}&email={{email}}
        data.dynamicTemplateData = {
            subject: 'Forgot Password',
            email: model.email,
            verifyCode: model.verifyCode,
        };

        return this.send(data);
    }

    async feedback(model: FeedbackEmailModel): Promise<boolean> {
        const data: MailData = {
            to: this.fromEmail,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.feedback,
        };

        // html: {{content}}
        data.dynamicTemplateData = {
            subject: 'Feedback',
            content: model.content,
        };

        return this.send(data);
    }

    async resendEmailVerificationLink(model: ResendEmailVerificationLinkEmailModel): Promise<boolean> {
        const data: MailData = {
            to: model.email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.resendEmailVerificationLink,
        };

        // url: /verify/{{verifyCode}}
        data.dynamicTemplateData = {
            subject: 'Email verification',
            verifyCode: model.verifyCode,
        };

        return this.send(data);
    }

    async paymentSuccessful(model: PaymentSuccessfulEmailModel): Promise<boolean> {
        const data: MailData = {
            to: model.email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.paymentSuccessful,
        };

        // html: {{amount}}
        data.dynamicTemplateData = {
            subject: 'Payment Successful',
            amount: model.amount,
        };

        return this.send(data);
    }

    async passwordUpdated(model: PasswordUpdatedEmailModel): Promise<boolean> {
        const data: MailData = {
            to: model.email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.passwordUpdated,
        };

        // html: {{email}}
        data.dynamicTemplateData = {
            subject: 'Password Updated',
        };

        return this.send(data);
    }

    async invite(model: InviteEmailModel): Promise<boolean> {
        const data: MailData = {
            to: model.emails,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.invite,
            isMultiple: true,
        };

        data.dynamicTemplateData = {
            subject: 'Invite',
        };

        return this.send(data);
    }

    async notification(model: NotificationEmailModel): Promise<boolean> {
        const data: MailData = {
            to: model.email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.notification,
        };

        data.dynamicTemplateData = {
            subject: 'Notification',
            title: model.title,
            body: model.body
        };

        return this.send(data);
    }

    async system(payloadData: any): Promise<boolean> {
        const data: MailData = {
            to: this.fromEmail,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.system,
        };

        let content = '';
        try {
            if (payloadData) {
                content = JSON.stringify(payloadData);
            } else {
                content = 'Error payload data was empty';
            }
        } catch (error) {
            try {
                if (error) {
                    content = `Error while stringifying error payload data: ${JSON.stringify(error)}`;
                }
            } finally { }
        }

        // html: {{data}}
        data.dynamicTemplateData = {
            subject: 'System',
            data: content,
        };

        return this.send(data);
    }

    async send(data: MailData): Promise<boolean> {
        if (!environment.production) {
            data.mailSettings = {
                sandboxMode: {
                    enable: true
                }
            };
        }

        if (environment.production) {
            try {
                const response = await sendGridMail.send(data);

                return response && response[0] && response[0].statusCode >= 200 && response[0].statusCode < 300;
            } catch (error) {
                throw error;
            }
        }

        return true;
    }
}

export const emailer = new Emailer();
