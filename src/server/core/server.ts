import { Application } from 'express';
import * as http from 'http';
import { broker } from '../broker/broker';
import { Database } from './database';
import { logger } from './utils/logger';
// Uncomment if swagger integration is needed

export class Server {

    static normalizePort(port: string | number): number | string | boolean {
        const parsedPort: number = (typeof port === 'string') ? parseInt(port, 10) : port;
        if (isNaN(parsedPort)) { // named pipe
            return port;
        }
        if (parsedPort >= 0) { // port number
            return parsedPort;
        }
        return false;
    }

    constructor(public httpServer: http.Server) { }

    init(app: Application): void {
        this.httpServer.on('listening', () => {
            logger.info(`App port:${app.get('port')}`);
        });

        this.httpServer.on('close', () => {
            this.destroy();
        });

        // TODO: potential events to listen on
        // this.httpServer.on('error', (error) => { });
        // process.on('SIGHUP', () => { });
        // process.on('SIGQUIT', () => { });
        // process.on('exit', () => { });

        process.on('SIGINT', () => {
            this.destroy();
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            this.destroy();
            process.exit(0);
        });

        process.on('uncaughtException', (event) => {
            logger.error('Internal: Uncaught exception', [event.stack]);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
            logger.error('Internal: UnhandledPromiseRejectionWarning', [reason.messsage || reason.stack, reason]);
            process.exit(1);
        });
    }

    destroy() {
        Database.clearDriver();
        broker.close();
    }
}
