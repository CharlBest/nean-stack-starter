import { Response } from 'express';

export abstract class BaseService {
    protected getUserId(res: Response): number {
        const user = res.locals.user;
        if (user && user.i) {
            return +user.i; // alias for id to keep payload light
        } else {
            throw new Error(`User ID is null or undefined`);
        }
    }

    protected getOptionalUserId(res: Response): number | null {
        const user = res.locals.user;
        if (user && user.i) {
            return +user.i; // alias for id to keep payload light
        } else {
            return null;
        }
    }
}
