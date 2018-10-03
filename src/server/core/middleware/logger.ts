import * as winston from 'winston';

const logger = winston.createLogger({
    transports: [
        //
        // In production create file called info.log with error, warn and info level logging in
        // Else create file called debug.log with error, warn, info, verbose and debug level logging in
        //
        new winston.transports.File({
            filename: process.env.NODE_ENV === 'production' ? 'info.log' : 'src/server/logs/debug.log',
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
        }),
        //
        // Set logging to ouput debug (all) to console if not in prod else only error console logs
        //
        new (winston.transports.Console)({
            level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
            format: winston.format.simple()
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.debug('Logging initialized at debug level');
}

export default logger;
