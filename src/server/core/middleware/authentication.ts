import { Request, Response, NextFunction } from 'express';
import { Database } from './../database';
import { verify } from 'jsonwebtoken';
import { environment } from '../../environments/environment';

export class Authentication {
    static loginRequired(req: Request | any, res: Response, next: NextFunction): void {
        if ((<any>req).user === null) {
            res.status(401).send({ detail: 'Unauthorized user' });
        }

        next();
    }

    static setAuthUser(req: Request | any, res: Response, next: NextFunction): void {
        const token = Authentication.getTokenInHeader(req);

        if (token === null) {
            (<any>req).user = null;
            next();
        } else {
            verify((<string>req.headers.authorization).split(' ')[1], environment.authentication.privateKey, (error, decode) => {
                if (error) {
                    (<any>req).user = null;
                    return res.status(401).json({ message: 'Unauthorized user' });
                }

                if (decode['data'] !== null && decode['data'] !== undefined) {
                    (<any>req).user = decode['data'];
                }

                next();
            });
        }
    }

    static getTokenInHeader(req: Request) {
        let token = null;
        const authorization = req.headers.authorization as string;

        // Retrieve the token form the Authorization header
        if (authorization && authorization.length > 8 && authorization.split(' ')[0] === 'Bearer') {
            token = authorization.split(' ')[1];
        }

        return token;
    }
}
