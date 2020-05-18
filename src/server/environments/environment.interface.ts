export interface Environment {
    production: boolean;
    port: number;
    database: {
        uri: string;
        name: string;
        // This needs to correspond with the Neo4j credentials .env in services
        adminUsername: string;
        adminPassword: string;
        username: string;
        password: string;
    };
    rabbitMQ: {
        virtualHost: string;
        adminUsername: string;
        adminPassword: string;
        username: string;
        password: string;
        port: number;
    };
    stripe: {
        secretKey: string;
        webhookKey: string;
    };
    email: {
        username: string;
        password: string;
    };
    authentication: {
        // This key can be anything. It will be used to sign (encrypt) and decrypt the passwords.
        privateKey: string;
    };
    vapidKey: {
        public: string;
        private: string;
    };
}
