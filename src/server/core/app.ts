import * as express from 'express';
import { bootstrap } from './bootstrap';
import { middleware } from './middleware/middleware';
import { Server } from './server';
import { initLogger } from './utils/logger';

class App {

    private express: express.Application = express();

    async bootstrapApp(): Promise<void> {
        // Initialise logger
        initLogger();

        // Create express app
        bootstrap.defineExpressApp(this.express);

        // Configure the app config for all the middlewares
        middleware.configure(this.express);

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
