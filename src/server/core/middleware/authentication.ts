import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { environment } from '../../environments/environment';

export class Authentication {
    static issuerName = 'nean-stack-starter';

    static loginRequired(req: Request, res: Response, next: NextFunction): void {
        if (!res.locals.user) {
            res.status(401).send({ detail: 'Unauthorized user' });
        }

        next();
    }

    static setAuthUser(req: Request, res: Response, next: NextFunction): void {
        const token = Authentication.getTokenInHeader(req);

        if (token === null) {
            res.locals.user = null;
            next();
        } else {
            verify(token, environment.authentication.privateKey, { issuer: Authentication.issuerName }, (error, decode) => {
                if (error) {
                    res.locals.user = null;
                    return res.status(401).json({ message: 'Unauthorized user' });
                }

                if (decode['data'] !== null && decode['data'] !== undefined) {
                    res.locals.user = decode['data'];
                }

                next();
            });
        }
    }

    static getTokenInHeader(req: Request): string {
        let token = null;
        const authorization = req.headers.authorization as string;

        // Retrieve the token form the Authorization header
        if (authorization && authorization.length > 8 && authorization.split(' ')[0] === 'Bearer') {
            token = authorization.split(' ')[1];
        }

        return token;
    }
}
