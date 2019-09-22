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
    email: {
        password: getEnvironmentVariable('EMAIL_PASSWORD', '***')
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
