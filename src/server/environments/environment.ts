export const environment = {
    production: process.env.NODE_ENV,
    appPort: process.env.APP_PORT,
    appHost: process.env.APP_HOST,
    database: {
        uri: process.env.DATABASE_URI,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD
    },
    azureBlobStorage: {
        blobServiceEndpoint: process.env.STORAGE_ENDPOINT,
        accountKey: process.env.STORAGE_KEY
    },
    stripe: {
        secretKey: process.env.STRIPE_KEY
    },
    sendGrid: {
        apiKey: process.env.SENDGRID_API_KEY,
        templates: {
            welcome: process.env.SENDGRID_TEMPLATE_WELCOME,
            forgotPassword: process.env.SENDGRID_TEMPLATE_FORGOT_PASSWORD
        }
    },
    authentication: {
        privateKey: process.env.AUTHENTICATION_KEY
    }
};
