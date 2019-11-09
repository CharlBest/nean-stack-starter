import { readFile } from 'fs';
// import { SendMailOptions } from 'nodemailer';
import { Email } from '../../communication/interfaces/email.interface';
import { FeedbackEmailModel } from '../../communication/models/email/feedback-email.model';
import { ForgotPasswordEmailModel } from '../../communication/models/email/forgot-password-email.model';
import { InviteEmailModel } from '../../communication/models/email/invite-email.model';
import { NotificationEmailModel } from '../../communication/models/email/notification-email.model';
import { PasswordUpdatedEmailModel } from '../../communication/models/email/password-updated-email.model';
import { PaymentSuccessfulEmailModel } from '../../communication/models/email/payment-successful-email.model';
import { ResendEmailVerificationLinkEmailModel } from '../../communication/models/email/resend-email-verification-link-email.model';
import { WelcomeEmailModel } from '../../communication/models/email/welcome-email.model';
import { logger } from '../../core/utils/logger';
import { environment } from '../../environments/environment';

const transporter = {} as any;
// const transporter = createTransport({
//     service: 'SendinBlue',
//     auth: {
//         user: 'interimproj@gmail.com',
//         pass: environment.email.password
//     }
// });

class Emailer implements Email {
    fromEmail = 'admin@nean.io';
    fromName = 'NEAN';

    async welcome(model: WelcomeEmailModel): Promise<boolean> {
        return this.send({
            to: model.email,
            from: this.fromEmail,
            sender: this.fromName,
            subject: 'Welcome',
            html: await this.getBody('welcome', {
                username: model.username,
                verifyCode: model.verifyCode,
            })
        });
    }

    async forgotPassword(model: ForgotPasswordEmailModel): Promise<boolean> {
        return this.send({
            to: model.email,
            from: this.fromEmail,
            sender: this.fromName,
            subject: 'Forgot Password',
            html: await this.getBody('forgot-password', {
                email: model.email,
                verifyCode: model.verifyCode,
            })
        });
    }

    async feedback(model: FeedbackEmailModel): Promise<boolean> {
        return this.send({
            to: this.fromEmail,
            from: this.fromEmail,
            sender: this.fromName,
            subject: 'Feedback',
            html: await this.getBody('feedback', {
                content: model.content,
            })
        });
    }

    async resendEmailVerificationLink(model: ResendEmailVerificationLinkEmailModel): Promise<boolean> {
        return this.send({
            to: model.email,
            from: this.fromEmail,
            sender: this.fromName,
            subject: 'Email verification',
            html: await this.getBody('email-verification', {
                verifyCode: model.verifyCode,
            })
        });
    }

    async paymentSuccessful(model: PaymentSuccessfulEmailModel): Promise<boolean> {
        return this.send({
            to: model.email,
            from: this.fromEmail,
            sender: this.fromName,
            subject: 'Payment Successful',
            html: await this.getBody('payment-successful', {
                amount: model.amount,
            })
        });
    }

    async passwordUpdated(model: PasswordUpdatedEmailModel): Promise<boolean> {
        return this.send({
            to: model.email,
            from: this.fromEmail,
            sender: this.fromName,
            subject: 'Password Updated',
            html: await this.getBody('password-updated')
        });
    }

    async invite(model: InviteEmailModel): Promise<boolean> {
        return this.send({
            to: model.emails,
            from: this.fromName,
            sender: this.fromEmail,
            subject: 'Invite',
            html: await this.getBody('invite')
        });
    }

    async notification(model: NotificationEmailModel): Promise<boolean> {
        return this.send({
            to: model.email,
            from: this.fromEmail,
            sender: this.fromName,
            subject: 'Notification',
            html: await this.getBody('notification', {
                title: model.title,
                body: model.body
            })
        });
    }

    async system(payloadData: any): Promise<boolean> {
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

        return this.send({
            to: this.fromEmail,
            from: this.fromEmail,
            sender: this.fromName,
            subject: 'System',
            html: await this.getBody('system', {
                data: content
            })
        });
    }

    async send(data: any/*SendMailOptions*/): Promise<boolean> {
        if (environment.production) {
            try {
                const info = await transporter.sendMail(data);

                return !!info.messageId;
            } catch (error) {
                logger.error('Email failed to send', error);
                throw error;
            }
        }

        return true;
    }

    private getBody(templateFileName: string, substitutions?: object): Promise<string> {
        return new Promise((resolve, reject) => {

            const rootPath = environment.production ? './email-templates' : '../email-templates';

            readFile(`${rootPath}/${templateFileName}.html`, { encoding: 'utf-8' }, (error, html) => {
                if (error) {
                    logger.error('Error fetching email template', error);
                    reject(error);
                }

                resolve(this.substitutePlaceholders(html, substitutions));
            });
        });

    }

    private substitutePlaceholders(html: string, substitutions?: object): string {
        // TODO: potential security vulnerability
        // Substitute placeholders
        if (substitutions) {
            for (const substitutionKey in substitutions) {
                if (substitutions.hasOwnProperty(substitutionKey)) {
                    try {
                        html = html.replace(`{{${substitutionKey}}}`, (substitutions as any).substitutionKey);
                    } catch (substitutionError) {
                        logger.error('Error substituting email template placeholder', substitutionError);
                    }
                }
            }
        }

        return html;
    }
}

export const emailer = new Emailer();
