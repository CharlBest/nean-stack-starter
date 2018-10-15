import { createQueueChannel } from '../broker/channel';

class App {
    queue = 'queue';

    constructor() { }

    async bootstrapApp(): Promise<void> {
        this.initMessageBroker();
    }

    initMessageBroker() {
        createQueueChannel(this.queue, (err: any, channel: any, conn: any) => {
            if (err) {
                console.error(err.stack);
            } else {
                console.log('channel and queue created');
                consume();
            }
            function consume() {
                channel.get('queue', {}, onConsume);
                function onConsume(err2: any, msg: any) {
                    if (err2) {
                        console.warn(err2.message);
                    } else if (msg) {
                        console.log('consuming %j', msg.content.toString());
                        setTimeout(function () {
                            channel.ack(msg);
                            consume();
                        }, 1e3);
                    } else {
                        console.log('no message, waiting...');
                        setTimeout(consume, 1e3);
                    }
                }
            }
        });
    }
}

export const app = new App();
