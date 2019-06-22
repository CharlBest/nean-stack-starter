import { logger } from '../core/utils/logger';

export const environment = {
    production: getEnvironmentVariable('NODE_ENV', 'development' as any) === 'production',
    port: getEnvironmentVariable('PORT', 3000),
    database: {
        uri: getEnvironmentVariable('DATABASE_URI', 'bolt://localhost'),
        username: getEnvironmentVariable('DATABASE_USERNAME', 'neo4j'),
        password: getEnvironmentVariable('DATABASE_PASSWORD', '1234')
    },
    stripe: {
        secretKey: getEnvironmentVariable('STRIPE_KEY', 'sk_test_RKOxhujxxM8c4xIqt6t036Qo')
    },
    sendGrid: {
        apiKey: getEnvironmentVariable('SENDGRID_API_KEY', '***'),
        templates: {
            welcome: getEnvironmentVariable('SENDGRID_TEMPLATE_WELCOME', 'd-3238c5b0d7504323b0a693b4d1038d26'),
            forgotPassword: getEnvironmentVariable('SENDGRID_TEMPLATE_FORGOT_PASSWORD', 'd-0a568babd3ee406995b624ae971b442d'),
            feedback: getEnvironmentVariable('SENDGRID_TEMPLATE_FEEDBACK', 'd-59414b3bf0f34e3bbf005410d0587060'),
            resendEmailVerificationLink:
                getEnvironmentVariable('SENDGRID_TEMPLATE_RESEND_EMAIL_VERIFICATION_LINK', 'd-aba9ca3bff4f4adbbdf7f255cf2dec6c'),
            paymentSuccessful: getEnvironmentVariable('SENDGRID_TEMPLATE_PAYMENT_SUCCESSFUL', 'd-590247b465184d61a718a9948087986d'),
            passwordUpdated: getEnvironmentVariable('SENDGRID_TEMPLATE_PASSWORD_UPDATED', 'd-d5dc72ebfbcb4750a511ffc7373f4eca'),
            invite: getEnvironmentVariable('SENDGRID_TEMPLATE_INVITE', 'd-77fe4e3da0cd4cdc8d51ef6c315b2d46'),
            notification: getEnvironmentVariable('SENDGRID_TEMPLATE_NOTIFICATION', 'd-3e61e949c11348f49fbcdd4bc254705b'),
            system: getEnvironmentVariable('SENDGRID_TEMPLATE_SYSTEM', 'd-da407da0241e44ea9a0e0c3278cad476'),
        }
    },
    authentication: {
        // This key can be anything. It can be a name or random characters. It will be used to sign (encrypt) and decrypt the passwords.
        privateKey: getEnvironmentVariable('AUTHENTICATION_KEY', '37LvDSm4XvjYOh9Y')
    },
    vapidKey: {
        // tslint:disable-next-line:max-line-length
        public: getEnvironmentVariable('VAPID_PUBLIC_KEY', 'BGdpTzg0UM2ZPfhAf88qoZ3CZS1trq0oEJTS14vHbV4SYjrxBLBj2jy4DYrXzhUJ_l5t_lybFleNDWv3ZWQQVZs'),
        private: getEnvironmentVariable('VAPID_PRIVATE_KEY', 'bqghrqfk5AiwPbOyJVSc1RgtaqmfJZAwX4uIDo0l8IA')
    },
    rabbitMQ: {
        amqpUrl: getEnvironmentVariable('AMQP_URL', 'amqp://guest:guest@localhost:5672')
    }
};

function getEnvironmentVariable<T>(key: string, defaultValue: T): T {
    const isProduction = process.env.NODE_ENV === 'production';
    if (!isProduction) {
        return defaultValue;
    } else {
        const value = process.env[key] as any;
        if (!value) {
            const error = `Environment variable with key ${key} does not exist`;
            logger.error(error);
            throw new Error(error);
        }

        return value;
    }
}
