import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
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

class Emailer implements Email {
    fromEmail = 'admin@nean.io';
    fromName = 'NEAN';
    transporter: Transporter;
    templates: { [key in keyof Email]: string } = {
        welcome: require('../email-templates/welcome.html'),
        forgotPassword: require('../email-templates/forgot-password.html'),
        feedback: require('../email-templates/feedback.html'),
        resendEmailVerificationLink: require('../email-templates/feedback.html'),
        paymentSuccessful: require('../email-templates/payment-successful.html'),
        passwordUpdated: require('../email-templates/password-updated.html'),
        invite: require('../email-templates/invite.html'),
        notification: require('../email-templates/notification.html'),
        system: require('../email-templates/system.html'),
    };

    initEmailer() {
        this.transporter = createTransport({
            host: 'smtp.zoho.com', // 300 free daily emails limit
            port: 465,
            auth: {
                user: environment.email.username,
                pass: environment.email.password
            },
            secure: true
        });
    }

    async welcome(model: WelcomeEmailModel): Promise<boolean> {
        return this.send({
            to: model.email,
            from: this.fromEmail,
            sender: this.fromName,
            subject: 'Welcome',
            html: this.substitutePlaceholders(this.templates.welcome, {
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
            html: this.substitutePlaceholders(this.templates.forgotPassword, {
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
            html: this.substitutePlaceholders(this.templates.feedback, {
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
            html: this.substitutePlaceholders(this.templates.resendEmailVerificationLink, {
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
            html: this.substitutePlaceholders(this.templates.paymentSuccessful, {
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
            html: this.substitutePlaceholders(this.templates.passwordUpdated)
        });
    }

    async invite(model: InviteEmailModel): Promise<boolean> {
        return this.send({
            to: model.emails,
            from: this.fromName,
            sender: this.fromEmail,
            subject: 'Invite',
            html: this.substitutePlaceholders(this.templates.invite)
        });
    }

    async notification(model: NotificationEmailModel): Promise<boolean> {
        return this.send({
            to: model.email,
            from: this.fromEmail,
            sender: this.fromName,
            subject: 'Notification',
            html: this.substitutePlaceholders(this.templates.notification, {
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
            html: this.substitutePlaceholders(this.templates.system, {
                data: content
            })
        });
    }

    async send(data: SendMailOptions): Promise<boolean> {
        if (environment.production) {
            try {
                const info = await this.transporter.sendMail(data);

                return !!info.messageId;
            } catch (error) {
                logger.error('Email failed to send', error);
                throw error;
            }
        }

        return true;
    }

    private substitutePlaceholders(html: string, substitutions?: object): string {
        // TODO: potential security vulnerability

        if (!html) {
            console.error('Template html is empty');
        }

        // Substitute placeholders
        if (substitutions) {
            for (const substitutionKey in substitutions) {
                if (substitutions.hasOwnProperty(substitutionKey)) {
                    try {
                        html = html.replace(`{{${substitutionKey}}}`, substitutions[substitutionKey]);
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
