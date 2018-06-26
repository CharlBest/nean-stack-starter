import { Response } from 'express';

export abstract class BaseController {
    constructor() { }

    protected returnError(response: Response, error: any) {
        response.status(error.status || 500).json(error.error);
    }
}
