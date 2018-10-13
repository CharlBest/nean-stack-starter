// @ts-check

import * as amqp from 'amqplib/callback_api';

// TODO: change guest username + password to actual user
const url = process.env.AMQP_URL || 'amqp://guest:guest@localhost:5672';

export function createQueueChannel(queue: string, cb: (anys: any, channel?: amqp.Channel, conn?: amqp.Connection) => void) {
    amqp.connect(url, onceConnected);

    function onceConnected(err: any, conn: amqp.Connection) {
        if (err) {
            console.error('Error connecting:', err.stack);
        } else {
            console.log('connected');
            conn.createChannel(onceChannelCreated);
        }

        function onceChannelCreated(error2: any, channel: amqp.Channel) {
            if (error2) {
                cb(error2);
            } else {
                channel.assertQueue(queue, { durable: true }, onceQueueCreated);
            }
            function onceQueueCreated(error3: any) {
                if (error3) {
                    cb(error3);
                } else {
                    cb(null, channel, conn);
                }
            }
        }
    }
}
