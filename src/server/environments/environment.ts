export const environment = {
    production: false,
    database: {
        uri: 'bolt://localhost',
        username: 'neo4j',
        password: 'demouser'
    },
    azureBlobStorage: {
        blobServiceEndpoint: 'https://devstorage.blob.core.windows.net',
        accountName: 'devstorage',
        accountKey: '***'
    },
    stripe: {
        secretKey: '***'
    },
    sendGrid: {
        apiKey: '***',
        templates: {
            welcome: '746786b0-9car-4c4c-a186-636d0ef62d1a',
            forgotPassword: '746786v0-acde-4c4c-09nh-636d0ef62d1b'
        }
    },
    authentication: {
        privateKey: '37LvDSm4XvjYOh9Y'
    }
};
