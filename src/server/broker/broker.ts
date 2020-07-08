import { Channel, connect, Connection } from 'amqplib';
import { logger } from '../core/utils/logger';
import { request } from '../core/utils/request';
import { environment } from '../environments/environment';
import { QueueType } from './queue-type.enum';

class Broker {
    connection: Connection;
    channel: Channel;

    async init(): Promise<void> {
        await this.setup();

        try {
            this.connection = await connect(`amqp://${environment.rabbitMQ.username}:${environment.rabbitMQ.password}@localhost:${environment.rabbitMQ.port}/${environment.rabbitMQ.virtualHost}`);
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

    private async setup(): Promise<void> {
        // Create virtual host
        try {
            await request({
                url: `http://${environment.rabbitMQ.adminUsername}:${environment.rabbitMQ.adminPassword}@localhost:15672/api/vhosts/${environment.rabbitMQ.virtualHost}`,
                method: 'PUT',
            });
        } catch (error) {
            logger.info('Creating virtual host', error);
        }

        // Create user
        try {
            await request({
                url: `http://${environment.rabbitMQ.adminUsername}:${environment.rabbitMQ.adminPassword}@localhost:15672/api/users/${environment.rabbitMQ.username}`,
                method: 'PUT',
                body: {
                    password: environment.rabbitMQ.password,
                    tags: 'none'
                }
            });
        } catch (error) {
            logger.info('Creating RabbitMQ user', error);
        }

        // Set permissions
        try {
            await request({
                url: `http://${environment.rabbitMQ.adminUsername}:${environment.rabbitMQ.adminPassword}@localhost:15672/api/permissions/${environment.rabbitMQ.virtualHost}/${environment.rabbitMQ.username}`,
                method: 'PUT',
                body: {
                    configure: '.*',
                    write: '.*',
                    read: '.*'
                }
            });
        } catch (error) {
            logger.info('Setting RabbitMQ user permissions', error);
        }

        logger.info('Broker init success');
    }

    close(): void {
        this.channel.close();
        this.connection.close();
    }
}

export const broker = new Broker();
