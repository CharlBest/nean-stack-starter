import { Response } from 'express';

export class ValidationUtil {
    static createValidationErrorMessage(key: string, message: string) {
        return {
            status: 400,
            validation: {
                [key]: {
                    message: message
                }
            }
        };
    }

    static createValidationErrors(errors: any) {
        return {
            status: 400,
            validation: errors
        };
    }

    static addFormError(res: Response, key: string, error: Object) {
        Object.assign(res.locals.error.formErrors, {
            [key]: error
        });
    }

    static addGlobalError(res: Response, key: string, error: Object) {
        Object.assign(res.locals.error.globalErrors, {
            [key]: error
        });
    }

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
