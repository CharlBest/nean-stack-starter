import { Channel, connect, Connection } from 'amqplib/callback_api';

// TODO: change guest username + password to actual user
const url = process.env.AMQP_URL || 'amqp://guest:guest@localhost:5672';

export function createQueueChannel(queue: string, cb: (something: any, channel?: Channel, connection?: Connection) => void) {
    connect(url, onceConnected);

    function onceConnected(err: any, conn: Connection) {
        if (err) {
            console.error('Error connecting:', err.stack);
        } else {
            console.log('connected');
            conn.createChannel(onceChannelCreated);
        }

        function onceChannelCreated(error2: any, channel: Channel) {
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
