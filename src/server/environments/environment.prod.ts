export const environment = {
    production: true,
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
        apiKey: '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',
        templates: {
            welcome: '746786b0-9car-4c4c-a186-636d0ef62d1a',
            forgotPassword: '746786v0-acde-4c4c-09nh-636d0ef62d1b'
        }
    },
    authentication: {
        privateKey: '37LvDSm4XvjYOh9Y'
    }
};
