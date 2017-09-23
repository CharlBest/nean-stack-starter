import { Request, Response } from 'express';

export class BaseController {
    constructor() { }
    // TODO: create convienient responses .notFound()... in base controller

    protected async setTitle(response: Response, title: string): Promise<void> {
        response.locals.title = title;
    }

    protected getUserId(req: Request): number {
        const user = (<any>req).user;
        if (user !== null && user !== undefined) {
            return user.id;
        } else {
            return null;
        }
    }

    protected returnError(response: Response, error: any) {
        response.status(error.status || 500).json(error.error);
    }
}
