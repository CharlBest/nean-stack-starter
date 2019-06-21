import { broker } from '../broker/broker';
import { QueueType } from '../broker/queue-type.enum';
import { Database } from '../core/database';
import { logger } from '../core/utils/logger';
import { emailer } from './communication/emailer';
import { pushNotification } from './communication/push-notification';

class App {
    constructor() { }

    async bootstrapApp(): Promise<void> {
        // Database
        await Database.getQueries();

        // Broker
        await broker.init();
        this.initMessageBroker();

        this.onDestroy();

        logger.info(`Worker is running`);
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
                    }, { noAck: false });
                }
            }
        } catch (error) {
            const errorMessage = `Error consuming broker channel`;
            logger.error(errorMessage, [error]);
            throw new Error(error);
        }
    }

    async processTask(queueType: string, data: any): Promise<boolean> {
        switch (QueueType[queueType]) {
            case QueueType.welcomeEmail:
                return emailer.welcome(data);

            case QueueType.forgotPasswordEmail:
                return emailer.forgotPassword(data);

            case QueueType.feedbackEmail:
                return emailer.feedback(data);

            case QueueType.resendEmailVerificationLinkEmail:
                return emailer.resendEmailVerificationLink(data);

            case QueueType.paymentSuccessfulEmail:
                return emailer.paymentSuccessful(data);

            case QueueType.passwordUpdatedEmail:
                return emailer.passwordUpdated(data);

            case QueueType.inviteEmail:
                return emailer.invite(data);

            case QueueType.notificationEmail:
                return emailer.notification(data);

            case QueueType.systemEmail:
                return emailer.system(data);

            case QueueType.newCommentPushNotification:
                return pushNotification.newComment(data);

            default:
                return false;
        }
    }

    onDestroy() {
        process.on('SIGTERM', () => {
            Database.clearDriver();
            broker.close();
            process.exit(0);
        });
    }
}

export const app = new App();
