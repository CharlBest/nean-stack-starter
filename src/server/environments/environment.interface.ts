export interface Environment {
    production: boolean;
    port: number;
    database: {
        uri: string;
        username: string;
        password: string;
    };
    stripe: {
        secretKey: string;
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
    rabbitMQ: {
        username: string;
        password: string;
        port: number;
    };
}
