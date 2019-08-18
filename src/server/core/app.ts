import * as express from 'express';
import { bootstrap } from './bootstrap';
import { appConfig } from './config/app-config';
import { Server } from './server';

class App {

    private express: express.Application = express();

    constructor() {
        // It also loads the .env file into the 'process.env' variable.
        // dotenv.config();
        // Create express app
        bootstrap.defineExpressApp(this.express);
    }

    async bootstrapApp(): Promise<void> {
        // Configure the app config for all the middlewares
        appConfig.configure(this.express);

        // Setup CORS
        bootstrap.setupCors(this.express);
        // Setup GraphQL
        // bootstrap.setupGraphQL(this.express);
        // Auth
        bootstrap.setupAuthentication(this.express);
        // Language
        bootstrap.setupLanguage(this.express);
        // Setup DB
        await bootstrap.setupDatabase(this.express);
        // Setup routes
        bootstrap.setupRoutes(this.express);
        // Setup core tools
        bootstrap.setupCoreTools(this.express);
        // Database data fetcher
        // bootstrap.setupAutoPeriodicDataFetch(this.express);
        // Broker
        bootstrap.setupBroker();

        // TODO: add logger (maybe morgan (http)) or custom
        // Setup errors
        bootstrap.setupErrors(this.express);

        const activeServer = bootstrap.startServer(this.express);

        // Setup web sockets
        bootstrap.setupWebSockets(activeServer);

        const server = new Server(activeServer);
        server.init(this.express);
    }
}

export const app = new App();
