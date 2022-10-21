import * as http from 'http';
import { logger } from './logger';

export enum RequestMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete',
}

export async function request<T = void>(
    url: string,
    method: RequestMethod,
    body?: object,
    headers?: object
): Promise<T> {
    return new Promise((resolve, reject) => {
        const reqOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            maxRedirects: 20
        };

        const req = http.request(url, reqOptions, (res) => {
            let data: any[] = []

            try {
                res.on('data', (chunk) => {
                    data.push(chunk)
                })

                res.on('end', () => {
                    const resBuffer = Buffer.concat(data)
                    try {
                        resolve(JSON.parse(resBuffer.toString()))
                    } catch {
                        resolve(resBuffer.toString() as any)
                    }
                })
            }
            catch (e) {
                reject(e)
            }
        });

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.on('error', error => {
            logger.error(error);
            reject(error);
        });

        req.end();
    });
}
