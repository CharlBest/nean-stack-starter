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
}
