import { Response } from 'express';

export abstract class BaseService {
    protected getUserId(res: Response): number {
        const user = res.locals.user;
        if (user !== null && user !== undefined) {
            return +user.id;
        } else {
            return null;
        }
    }
}
