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
        data['dynamic_template_data'] = {
            subject: 'Welcome',
            username: model.username,
            emailVerifyCode: model.emailVerifyCode,
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

        // url: /forgot-password/reset?code={{forgotPasswordCode}}&email={{email}}
        data['dynamic_template_data'] = {
            subject: 'Forgot Password',
            email: model.email,
            forgotPasswordCode: model.forgotPasswordCode,
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

        // html: {{feedbackContent}}
        data['dynamic_template_data'] = {
            subject: 'Feedback',
            feedbackContent: model.feedbackContent,
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

        // url: /verify/{{emailVerifyCode}}
        data['dynamic_template_data'] = {
            subject: 'Email verification',
            emailVerifyCode: model.emailVerifyCode,
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
        data['dynamic_template_data'] = {
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
        data['dynamic_template_data'] = {
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

        data['dynamic_template_data'] = {
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

        data['dynamic_template_data'] = {
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
        data['dynamic_template_data'] = {
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
            // return from(sendGridMail.send(data, undefined, (error: Error) => {
            //     if (error) {
            //         // logger.error(err);
            //         throw new Error('Error while trying to send the email');
            //         // TODO: save against profile that email failed to send (maybe)
            //     }
            // })).pipe(map(x => x && x[0] && x[0].statusCode >= 200 && x[0].statusCode < 300));

            try {
                const response = await sendGridMail.send(data, undefined, (error: Error) => {
                    if (error) {
                        // logger.error(err);
                        throw new Error('Error while trying to send the email');
                        // TODO: save against profile that email failed to send (maybe)
                    }
                });

                return response && response[0] && response[0].statusCode >= 200 && response[0].statusCode < 300;
            } catch (error) {
                // logger.error(err);
                return false;
            }
        }

        return true;
    }
}

export const emailer = new Emailer();
