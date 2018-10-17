import { broker } from '../broker/broker';
import { QueueType } from '../broker/queue-type.enum';
import { logger } from '../core/utils/logger';
import { emailer } from './communication/emailer';

class App {
    constructor() { }

    async bootstrapApp(): Promise<void> {
        await broker.init();
        this.initMessageBroker();

        process.on('SIGTERM', () => {
            console.log('close');
            broker.close();
            process.exit(0);
        });
    }

    async initMessageBroker(): Promise<void> {
        try {
            // Only dispatch 1 at a time to a consumer
            // TODO: according to the RabbitMQ docs: 100 through 300 range usually offer optimal throughput
            broker.channel.prefetch(1);

            for (const queueType in QueueType) {
                if (queueType) {
                    await broker.channel.consume(QueueType[queueType], (message) => {
                        if (message) {
                            try {
                                const data = JSON.parse(message.content.toString());
                                this.processTask(<QueueType>queueType, data);
                                broker.channel.ack(message);
                            } catch (error) {
                                const errorMessage = `Error parsing work queue data payload`;
                                logger.error(errorMessage, [error]);
                                throw new Error(error);
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

    processTask(queueType: QueueType, data: any) {
        switch (QueueType[queueType]) {
            case QueueType.welcomeEmail:
                emailer.welcome(data);
                break;

            default:
                break;
        }
    }
}

export const app = new App();
