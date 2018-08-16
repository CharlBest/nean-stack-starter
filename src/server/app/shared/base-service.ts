import { Response } from 'express';

export abstract class BaseService {
    protected getUserId(res: Response): number {
        const user = res.locals.user;
        if (user !== null && user !== undefined) {
            return +user.i; // alias for id to keep payload light
        } else {
            console.log('User is not logged in');
            return null;
        }
    }
}
