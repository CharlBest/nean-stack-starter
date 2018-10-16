import { logger } from '../core/utils/logger';
import { broker } from './broker';
import { QueueType } from './queue-type.enum';

class BrokerManager {
    private encode(data: string) {
        return Buffer.from(JSON.stringify(data));
    }

    async sendToQueue(queueType: QueueType, data: any): Promise<void> {
        try {
            broker.channel.sendToQueue(queueType, this.encode(data), {
                persistent: true
            });
        } catch (error) {
            const errorMessage = `Error sending to queue on RabbitMQ`;
            logger.error(errorMessage, [error]);
            throw new Error(error);
        }
    }
}

export const brokerManager = new BrokerManager();
