import { Environment } from './environment.interface';

const processEnvironment: Environment | any = {
    production: process.env.NODE_ENV === 'production',
    port: process.env.PORT ? +process.env.PORT : undefined,
    database: {
        uri: process.env.NEO4J_URI,
        username: process.env.NEO4J_USERNAME,
        password: process.env.NEO4J_PASSWORD
    },
    stripe: {
        secretKey: process.env.STRIPE_KEY
    },
    email: {
        password: process.env.SENDGRID_EMAIL_PASSWORD
    },
    authentication: {
        privateKey: process.env.AUTHENTICATION_KEY
    },
    vapidKey: {
        public: process.env.VAPID_PUBLIC_KEY,
        private: process.env.VAPID_PRIVATE_KEY
    },
    rabbitMQ: {
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD,
        port: process.env.RABBITMQ_PORT ? +process.env.RABBITMQ_PORT : undefined
    }
};

export function initEnvironment(injectEnvironment: Environment) {
    if (processEnvironment.production) {
        environment = processEnvironment;
    } else {
        environment = injectEnvironment;
    }
}

export let environment: Environment;