import { Application } from 'express';
import * as http from 'http';
// import { SwaggerUI } from './SwaggerUI';
import { Database } from './database';

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

    use(app: Application): void {
        this.httpServer.on('listening', () => {
            console.log(`Aloha, your app is ready on ${app.get('host') || 'localhost'}:${app.get('port')}`);
        });

        // this.httpServer.on('error', (error) => { });

        this.httpServer.on('close', () => {
            Database.clearDriver();
        });

        // process.on('SIGINT', () => { });
        // process.on('SIGHUP', () => { });
        // process.on('SIGQUIT', () => { });
        // process.on('exit', () => { });

        process.on('SIGTERM', () => {
            Database.clearDriver();
            process.exit(0);
        });

        process.on('uncaughtException', (event) => {
            process.stderr.write('Internal: Uncaught exception\n');
            process.stderr.write(event.stack + '\n');
            process.exit(1);
        });

        process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
            process.stderr.write('Internal: UnhandledPromiseRejectionWarning\n');
            process.stderr.write(reason + '\n');
            console.log(reason.stack || reason.messsage || reason);

            process.exit(1);
        });
    }
}
