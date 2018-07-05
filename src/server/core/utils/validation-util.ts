import { Response } from 'express';

export class ValidationUtil {
    static errorResponse(res: Response) {
        return {
            status: 400,
            validation: {
                formErrors: res.locals.error.formErrors,
                globalErrors: res.locals.error.globalErrors
            }
        };
    }
}
