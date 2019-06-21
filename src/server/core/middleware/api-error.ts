import { NextFunction, Request, Response } from 'express';

export class ApiError {
    // catch 404 and forward to error handler
    static NotFound(req: Request, res: Response, next: NextFunction) {
        const err: any = new Error('Not Found');
        err.status = 404;
        next(err);
    }

    // error handlers
    // development error handler
    // will print stacktrace
    static InternalServerDev(err: any, req: Request, res: Response, next: NextFunction) {
        res.status(err.status || 400);
        res.send({
            message: err.message,
            error: {
                error: err,
                validation: {
                    formErrors: res.locals.error && res.locals.error.formErrors ? res.locals.error.formErrors : null,
                    globalErrors: res.locals.error && res.locals.error.globalErrors ? res.locals.error.globalErrors : null
                }
            }
        });
    }

    static InternalServerProd(err: any, req: Request, res: Response, next: NextFunction) {
        res.status(err.status || 400);
        res.send({
            message: err.message,
            error: {
                validation: {
                    formErrors: res.locals.error && res.locals.error.formErrors ? res.locals.error.formErrors : null,
                    globalErrors: res.locals.error && res.locals.error.globalErrors ? res.locals.error.globalErrors : null
                }
            }
        });
    }
}
