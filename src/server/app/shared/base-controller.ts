import { Response } from 'express';

export abstract class BaseController {
    readonly DEFAULT_PAGE_SIZE = 50;
    constructor() { }

    protected returnError(response: Response, error: any) {
        response.status(error.status || 500).json(error.error);
    }
}
