// tslint:disable: no-hardcoded-credentials
import { Environment } from '../../environments/environment.interface';

export const environment: Environment = {
    production: process.env.NODE_ENV === 'production',
    port: 3000,
    database: {
        uri: 'bolt://localhost',
        username: 'server_web',
        password: 'password'
    },
    rabbitMQ: {
        username: 'server_web',
        password: 'password',
        port: 5672
    },
    stripe: {
        secretKey: 'sk_test_RKOxhujxxM8c4xIqt6t036Qo'
    },
    email: {
        password: '***'
    },
    authentication: {
        privateKey: '37LvDSm4XvjYOh9Y'
    },
    vapidKey: {
        public: 'BGdpTzg0UM2ZPfhAf88qoZ3CZS1trq0oEJTS14vHbV4SYjrxBLBj2jy4DYrXzhUJ_l5t_lybFleNDWv3ZWQQVZs',
        private: 'bqghrqfk5AiwPbOyJVSc1RgtaqmfJZAwX4uIDo0l8IA'
    }
};