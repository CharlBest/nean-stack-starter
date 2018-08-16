import { NextFunction, Request, Response } from 'express';

export class ApiError {
    // catch 404 and forward to error handler
    static NotFoundError(req: Request, res: Response, next: NextFunction) {
        const err: any = new Error('Not Found');
        err.status = 404;
        next(err);
    }

    // error handlers
    // development error handler
    // will print stacktrace
    static InternalServerErrorDev(err: any, req: Request, res: Response, next: NextFunction) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    }

    static InternalServerErrorProd(err: any, req: Request, res: Response, next: NextFunction) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: { validation: err.validation }
        });
    }
}
