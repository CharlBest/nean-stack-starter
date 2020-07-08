import { NextFunction, Request, Response } from 'express';

export class ApiError {
    // catch 404 and forward to error handler
    static NotFound(req: Request, res: Response, next: NextFunction): void {
        const err: Error = new Error('Not Found');
        res.status(404);
        next(err);
    }

    // error handlers
    // development error handler
    // will print stacktrace
    static InternalServerDev(err: Error, req: Request, res: Response, next: NextFunction): void {
        if (!res.statusCode || (res.statusCode && res.statusCode >= 200 && res.statusCode < 300)) {
            res.status(400);
        }
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

    static InternalServerProd(err: Error, req: Request, res: Response, next: NextFunction): void {
        if (!res.statusCode || (res.statusCode && res.statusCode >= 200 && res.statusCode < 300)) {
            res.status(400);
        }
        res.send({
            // Hide this from the public as it can potentially expose sensitive data
            // message: err.message,
            error: {
                validation: {
                    formErrors: res.locals.error && res.locals.error.formErrors ? res.locals.error.formErrors : null,
                    globalErrors: res.locals.error && res.locals.error.globalErrors ? res.locals.error.globalErrors : null
                }
            }
        });
    }
}
