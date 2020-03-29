import { Channel, connect, Connection } from 'amqplib';
import { logger } from '../core/utils/logger';
import { environment } from '../environments/environment';
import { QueueType } from './queue-type.enum';

class Broker {
    connection: Connection;
    channel: Channel;

    async init(): Promise<void> {
        try {
            this.connection = await connect(`amqp://${environment.rabbitMQ.username}:${environment.rabbitMQ.password}@localhost:${environment.rabbitMQ.port}`);
            this.channel = await this.connection.createChannel();

            for (const queueType in QueueType) {
                if (QueueType.hasOwnProperty(queueType) && queueType) {
                    await this.channel.assertQueue(QueueType[queueType], { durable: true });
                }
            }
        } catch (error) {
            const errorMessage = `Error connecting or creating channels on RabbitMQ`;
            logger.error(errorMessage, [error]);
            throw new Error(error);
        }
    }

    close() {
        this.channel.close();
        this.connection.close();
    }
}

export const broker = new Broker();
