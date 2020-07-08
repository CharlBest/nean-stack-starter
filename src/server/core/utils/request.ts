import * as http from 'http';
import { logger } from './logger';

export async function request(options: {
    url: string,
    method: string,
    body?: object,
    headers?: any
}): Promise<void> {
    return new Promise((resolve, reject) => {
        const reqOptions = {
            method: options.method,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            maxRedirects: 20
        };

        const req = http.request(options.url, reqOptions, (res) => {
            // NodeJS bug! Bellow line has to be present eventhough it's empty.
            res.on('data', () => { });
            res.on('end', () => {
                resolve();
            });
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.on('error', error => {
            logger.error(error);
            reject(error);
        });

        req.end();
    });
}
