import { Environment } from './environment.interface';

const env = process.env as any;

export let environment: Environment = {
    production: env.NODE_ENV === 'production',
    port: +env.PORT,
    database: {
        uri: env.NEO4J_URI,
        name: env.NEO4J_NAME,
        adminUsername: env.NEO4J_ADMIN_USERNAME,
        adminPassword: env.NEO4J_ADMIN_PASSWORD,
        username: env.NEO4J_USERNAME,
        password: env.NEO4J_PASSWORD
    },
    rabbitMQ: {
        virtualHost: env.RABBITMQ_VIRTUAL_HOST,
        adminUsername: env.RABBITMQ_ADMIN_USERNAME,
        adminPassword: env.RABBITMQ_ADMIN_PASSWORD,
        username: env.RABBITMQ_USERNAME,
        password: env.RABBITMQ_PASSWORD,
        port: +env.RABBITMQ_PORT
    },
    stripe: {
        secretKey: env.STRIPE_KEY,
        webhookSigningSecret: env.STRIPE_WEBHOOK_SIGNING_SECRET
    },
    authentication: {
        privateKey: env.AUTHENTICATION_KEY
    },
    email: {
        username: env.EMAIL_USERNAME,
        password: env.EMAIL_PASSWORD
    },
    vapidKey: {
        public: env.VAPID_PUBLIC_KEY,
        private: env.VAPID_PRIVATE_KEY
    }
};