import { logger } from '../core/utils/logger';
import { broker } from './broker';
import { QueueType } from './queue-type.enum';

class BrokerManager {

    async sendToQueue(queueType: QueueType, data: any): Promise<void> {
        const errorMessage = `Error sending to queue on RabbitMQ`;

        try {
            const success = broker.channel.sendToQueue(queueType, this.encode(data), {
                persistent: true
            });

            if (!success) {
                throw new Error(errorMessage);
            }
        } catch (error) {
            logger.error(errorMessage, [error]);
            throw new Error(error);
        }
    }

    private encode(data: string) {
        return Buffer.from(JSON.stringify(data));
    }

}

export const brokerManager = new BrokerManager();
