import { createLogger, format, transports } from 'winston';
import { emailBroker } from '../../communication/emailer-broker';

export const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        //
        // In production create file called info.log with error, warn and info level logging in
        // Else create file called debug.log with error, warn, info, verbose and debug level logging in
        //
        new transports.File({
            filename: process.env.NODE_ENV === 'production' ? 'info.log' : 'src/server/logs/debug.log',
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
        }),
        //
        // Set logging to ouput debug (all) to console if not in prod else only error console logs
        //
        new (transports.Console)({
            level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
        })
    ]
});

logger.on('error', (error) => {
    // TODO: This could potentially cause an infinite loop if this method (emailer) causes an error
    emailBroker.system(error);
});

if (process.env.NODE_ENV !== 'production') {
    logger.debug('Logging initialized at debug level');
}
