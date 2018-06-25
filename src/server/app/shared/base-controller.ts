import { Request, Response } from 'express';

export abstract class BaseController {
    constructor() { }

    protected getUserId(req: Request): number {
        const user = (<any>req).user;
        if (user !== null && user !== undefined) {
            return +user.id;
        } else {
            return null;
        }
    }

    protected returnError(response: Response, error: any) {
        response.status(error.status || 500).json(error.error);
    }
}
