import { createLogger, format, Logger, transports } from 'winston';
import { environment } from '../../environments/environment';

export function initLogger() {
    logger = createLogger({
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
                filename: environment.production ? 'info.log' : 'src/server/logs/debug.log',
                level: environment.production ? 'info' : 'debug'
            }),
            //
            // Set logging to ouput debug (all) to console if not in prod else only error console logs
            //
            new (transports.Console)({
                level: environment.production ? 'info' : 'debug'
            })
        ]
    });

    logger.on('error', (error) => {
        // TODO: This could potentially cause an infinite loop if this method (emailer) causes an error
        // emailBroker.system(error);
    });

    if (!environment.production) {
        logger.debug('Logging initialized at debug level');
    }
}

export let logger: Logger;