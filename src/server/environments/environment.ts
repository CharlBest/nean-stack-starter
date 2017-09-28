export const environment = {
    production: getEnvironmentVariable('NODE_ENV', 'development'),
    port: getEnvironmentVariable('PORT', 3000),
    appHost: getEnvironmentVariable('APP_HOST', ''),
    database: {
        uri: getEnvironmentVariable('DATABASE_URI', 'bolt://localhost'),
        username: getEnvironmentVariable('DATABASE_USERNAME', 'neo4j'),
        password: getEnvironmentVariable('DATABASE_PASSWORD', 'demouser')
    },
    azureBlobStorage: {
        blobServiceEndpoint: getEnvironmentVariable('STORAGE_ENDPOINT', 'https://devstorage.blob.core.windows.net'),
        accountKey: getEnvironmentVariable('STORAGE_KEY', '***')
    },
    stripe: {
        secretKey: getEnvironmentVariable('STRIPE_KEY', '***')
    },
    sendGrid: {
        apiKey: getEnvironmentVariable('SENDGRID_API_KEY', '***'),
        templates: {
            welcome: getEnvironmentVariable('SENDGRID_TEMPLATE_WELCOME', '746786b0-9car-4c4c-a186-636d0ef62d1a'),
            forgotPassword: getEnvironmentVariable('SENDGRID_TEMPLATE_FORGOT_PASSWORD', '746786b0-9car-4c4c-a186-636d0ef62d1a')
        }
    },
    authentication: {
        privateKey: getEnvironmentVariable('AUTHENTICATION_KEY', '37LvDSm4XvjYOh9Y')
    }
};

function getEnvironmentVariable(key: string, defaultValue: any) {
    const isProduction = process.env.NODE_ENV === 'production';
    if (!isProduction) {
        return defaultValue;
    } else {
        const value = process.env[key];
        if (value === undefined) {
            throw new Error(`Environment variable with key ${key} does not exist`);
        }

        return value;
    }
}
