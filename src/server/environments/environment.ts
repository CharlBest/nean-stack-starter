import { Environment } from './environment.interface';

const productionEnvironment: Environment | any = {
    production: process.env.NODE_ENV === 'production',
    port: process.env.PORT ? +process.env.PORT : undefined,
    database: {
        uri: process.env.NEO4J_URI,
        username: process.env.NEO4J_USERNAME,
        password: process.env.NEO4J_PASSWORD
    },
    rabbitMQ: {
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD,
        port: process.env.RABBITMQ_PORT ? +process.env.RABBITMQ_PORT : undefined
    },
    stripe: {
        secretKey: process.env.STRIPE_KEY
    },
    email: {
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD
    },
    authentication: {
        privateKey: process.env.AUTHENTICATION_KEY
    },
    vapidKey: {
        public: process.env.VAPID_PUBLIC_KEY,
        private: process.env.VAPID_PRIVATE_KEY
    }
};

export function initEnvironment(injectEnvironment: Environment) {
    if (productionEnvironment.production) {
        environment = productionEnvironment;
    } else {
        environment = injectEnvironment;
    }
}

export let environment: Environment;