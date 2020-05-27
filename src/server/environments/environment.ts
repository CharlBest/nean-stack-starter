// tslint:disable: no-non-null-assertion
import { Environment } from './environment.interface';

export let environment: Environment = {
    production: process.env.NODE_ENV === 'production',
    port: +process.env.PORT!,
    database: {
        uri: process.env.NEO4J_URI!,
        name: process.env.NEO4J_NAME!,
        adminUsername: process.env.NEO4J_ADMIN_USERNAME!,
        adminPassword: process.env.NEO4J_ADMIN_PASSWORD!,
        username: process.env.NEO4J_USERNAME!,
        password: process.env.NEO4J_PASSWORD!
    },
    rabbitMQ: {
        virtualHost: process.env.RABBITMQ_VIRTUAL_HOST!,
        adminUsername: process.env.RABBITMQ_ADMIN_USERNAME!,
        adminPassword: process.env.RABBITMQ_ADMIN_PASSWORD!,
        username: process.env.RABBITMQ_USERNAME!,
        password: process.env.RABBITMQ_PASSWORD!,
        port: +process.env.RABBITMQ_PORT!
    },
    stripe: {
        secretKey: process.env.STRIPE_KEY!,
        webhookSigningSecret: process.env.STRIPE_WEBHOOK_SIGNING_SECRET!
    },
    authentication: {
        privateKey: process.env.AUTHENTICATION_KEY!
    },
    email: {
        username: process.env.EMAIL_USERNAME!,
        password: process.env.EMAIL_PASSWORD!
    },
    vapidKey: {
        public: process.env.VAPID_PUBLIC_KEY!,
        private: process.env.VAPID_PRIVATE_KEY!
    }
};