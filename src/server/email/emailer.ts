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
            to: {
                email,
                name: Emailer.fromName
            },
            from: Emailer.fromEmail,
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
            to: {
                email,
                name: Emailer.fromName
            },
            from: Emailer.fromEmail,
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
            to: {
                email: 'admin@nean.io',
                name: Emailer.fromName
            },
            from: Emailer.fromEmail,
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
            to: {
                email,
                name: Emailer.fromName
            },
            from: Emailer.fromEmail,
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
            to: {
                email,
                name: Emailer.fromName
            },
            from: Emailer.fromEmail,
            templateId: environment.sendGrid.templates.paymentSuccessful,
        };

        // html: {{amount}}
        // url: /verify/{{emailVerifyCode}}
        data['dynamic_template_data'] = {
            subject: 'Payment Successful',
            amount,
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

        sendGridMail.send(data, null, (err, res) => {
            if (err) {
                console.log(err);
                throw err;
                // TODO: save against profile that email failed to send (maybe)
            }
        });
    }
}
