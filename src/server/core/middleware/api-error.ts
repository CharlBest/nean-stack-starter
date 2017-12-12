import { Request, Response, NextFunction } from 'express';

export class ApiError {
    static wrapAsync = (fn) => {
        return function(req, res, next) {
            // Wrap async functions in this function so that any errors are caught and
            // passed along to the error handler middleware.
            // http://thecodebarbarian.com/80-20-guide-to-express-error-handling.html
            fn(req, res, next).catch(next);
        };
    }

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
            error: {}
        });
    }
}
