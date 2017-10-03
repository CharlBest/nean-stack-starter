export class ValidationUtil {
    static createValidationErrorMessage(key: string, message: string) {
        return {
            status: 400,
            error: {
                [key]: {
                    message: message
                }
            }
        };
    }

    static createValidationErrors(errors: any) {
        return {
            status: 400,
            error: errors
        };
    }
}
