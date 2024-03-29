import { ConsumeMessage } from 'amqplib';
import { broker } from '../broker/broker';
import { QueueType } from '../broker/queue-type.enum';
import { Database } from '../core/database';
import { initLogger, logger } from '../core/utils/logger';
import { emailer } from './communication/emailer';
import { pushNotification } from './communication/push-notification';
import { cron } from './cron';

class App {

    async bootstrapApp(): Promise<void> {
        // Initialise logger
        initLogger();

        this.processEventHandlers();

        // Initialize Emailer
        emailer.initEmailer();

        // Database
        await Database.init();

        // Broker
        await broker.init();
        this.initMessageBroker();

        // Cron
        cron.init();
    }

    async initMessageBroker(): Promise<void> {
        try {
            // Only dispatch 1 at a time to a consumer
            // TODO: according to the RabbitMQ docs: 100 through 300 range usually offer optimal throughput
            broker.channel.prefetch(1);

            for (const queueType in QueueType) {
                if (QueueType.hasOwnProperty(queueType) && queueType) {
                    await broker.channel.consume(QueueType[queueType], async (message) => {
                        if (message) {
                            this.processMessage(message, queueType);
                        }
                    }, { noAck: false });
                }
            }
        } catch (error) {
            const errorMessage = `Error consuming broker channel`;
            logger.error(errorMessage, [error]);
            throw new Error(error);
        }
    }

    async processMessage(message: ConsumeMessage, queueType: string): Promise<void> {
        try {
            const data = JSON.parse(message.content.toString());

            const success = await this.processTask(queueType, data);
            if (success) {
                broker.channel.ack(message);
            } else {
                if (message.fields.redelivered) {
                    logger.error('Error processing message in work queue', [message]);
                    // Message will be lost
                    broker.channel.nack(message, undefined, false);
                } else {
                    broker.channel.nack(message);
                }
            }
        } catch (error) {
            if (message.fields.redelivered) {
                logger.error('Exception processing message in work queue', [error.toString()]);
                // Message will be lost
                broker.channel.nack(message, undefined, false);
            } else {
                broker.channel.nack(message);
            }
        }
    }

    async processTask(queueType: string, data: any): Promise<boolean> {
        switch (QueueType[queueType]) {
            case QueueType.WELCOME_EMAIL:
                return emailer.welcome(data);

            case QueueType.FORGOT_PASSWORD_EMAIL:
                return emailer.forgotPassword(data);

            case QueueType.FEEDBACK_EMAIL:
                return emailer.feedback(data);

            case QueueType.RESEND_EMAIL_VERIFICATION_LINK_EMAIL:
                return emailer.resendEmailVerificationLink(data);

            case QueueType.PAYMENT_SUCCESSFUL_EMAIL:
                return emailer.paymentSuccessful(data);

            case QueueType.PASSWORD_UPDATED_EMAIL:
                return emailer.passwordUpdated(data);

            case QueueType.INVITE_EMAIL:
                return emailer.invite(data);

            case QueueType.NOTIFICATION_EMAIL:
                return emailer.notification(data);

            case QueueType.SYSTEM_EMAIL:
                return emailer.system(data);

            case QueueType.NEW_COMMENT_PUSH_NOTIFICATION:
                return pushNotification.newComment(data);

            default:
                return false;
        }
    }

    processEventHandlers(): void {
        process.on('SIGINT', (event) => {
            logger.debug('SIGINT', event);
            this.onDestroy()
        });

        process.on('SIGTERM', (event) => {
            logger.debug('SIGTERM', event);
            this.onDestroy()
        });


        process.on('uncaughtException', (event) => {
            logger.error('Internal: Uncaught exception', [event.stack]);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason: any, promise: Promise<unknown>) => {
            logger.error('Internal: UnhandledPromiseRejectionWarning', [reason.messsage || reason.stack, reason]);
            process.exit(1);
        });
    }

    onDestroy(): void {
        Database.clearDriver();
        broker.close();
        process.exit(0);
    }
}

export const app = new App();
