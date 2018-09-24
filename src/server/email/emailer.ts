import { MailData } from '@sendgrid/helpers/classes/mail';
import * as sendGridMail from '@sendgrid/mail';
import { environment } from '../environments/environment';

sendGridMail.setApiKey(environment.sendGrid.apiKey);
sendGridMail.setSubstitutionWrappers('{{', '}}');

export class Emailer {
    static fromEmail = 'admin@nean.io';
    static fromName = 'NEAN';

    static welcomeEmail(email: string, username: string, emailVerifyCode: string) {
        const data: MailData = {
            to: email,
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
            username,
            emailVerifyCode,
        };

        Emailer.send(data);
    }

    static forgotPasswordEmail(email: string, forgotPasswordCode: string) {
        const data: MailData = {
            to: email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.forgotPassword,
        };

        // url: /forgot-password/reset?code={{forgotPasswordCode}}&email={{email}}
        data['dynamic_template_data'] = {
            subject: 'Forgot Password',
            email,
            forgotPasswordCode,
        };

        Emailer.send(data);
    }

    static feedbackEmail(feedbackContent: string) {
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
            feedbackContent,
        };

        Emailer.send(data);
    }

    static resendEmailVerificationLinkEmail(email: string, emailVerifyCode: string) {
        const data: MailData = {
            to: email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.resendEmailVerificationLink,
        };

        // url: /verify/{{emailVerifyCode}}
        data['dynamic_template_data'] = {
            subject: 'Email verification',
            emailVerifyCode,
        };

        Emailer.send(data);
    }

    static paymentSuccessfulEmail(email: string, amount: number) {
        const data: MailData = {
            to: email,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            templateId: environment.sendGrid.templates.paymentSuccessful,
        };

        // html: {{amount}}
        data['dynamic_template_data'] = {
            subject: 'Payment Successful',
            amount,
        };

        Emailer.send(data);
    }

    static passwordUpdated(email: string) {
        const data: MailData = {
            to: email,
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

        Emailer.send(data);
    }

    static invite(emails: Array<string>) {
        const data: MailData = {
            to: emails,
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

        Emailer.send(data);
    }

    static send(data: MailData) {
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
                    console.log(err);
                    throw err;
                    // TODO: save against profile that email failed to send (maybe)
                }
            });
        }
    }
}
