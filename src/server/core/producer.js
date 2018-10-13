// @ts-check

var Channel = require('./channel');
var queue = 'queue';

Channel.createQueueChannel(queue, function (err, channel, conn) {
    if (err) {
        console.error(err.stack);
    }
    else {
        console.log('channel and queue created');
        var work = 'make me a sandwich';
        const success = channel.sendToQueue(queue, encode(work), {
            persistent: true
        });

        console.log(success);

        setImmediate(function () {
            channel.close(null);
            conn.close();
        });
    }
});

function encode(doc) {
    return Buffer.from(JSON.stringify(doc));
}