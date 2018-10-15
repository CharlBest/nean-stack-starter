import { createQueueChannel } from './channel';
const queue = 'queue';

class Broker {

    static encode(data: string) {
        return Buffer.from(JSON.stringify(data));
    }

    async sendToQueue(data: any): Promise<void> {
        createQueueChannel(queue, function (err, channel, conn) {
            if (err) {
                console.error(err.stack);
            } else {
                console.log('channel and queue created');
                const work = 'make me a sandwich';
                if (channel) {
                    const success = channel.sendToQueue(queue, Broker.encode(data), {
                        persistent: true
                    });

                    console.log(success);

                    // setImmediate(function () {
                    //     channel.close(null);
                    //     conn.close();
                    // });
                }
            }
        });
    }
}

export const broker = new Broker();
