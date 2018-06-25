import * as express from 'express';
import { Bootstrap } from './bootstrap';
import { AppConfig } from './config/app-config';
// import * as dotenv from 'dotenv';
import { Server } from './server';

export class App {

    private express: express.Application = express();
    private bootstrapApp = new Bootstrap();

    constructor() {
        // It also loads the .env file into the 'process.env' variable.
        // dotenv.config();
        // Create express app
        this.bootstrapApp.defineExpressApp(this.express);
    }

    public async bootstrap(): Promise<void> {
        // Configure the app config for all the middlewares
        const appConfig = new AppConfig();
        appConfig.configure(this.express);

        // Setup CORS
        this.bootstrapApp.setupCors(this.express);
        // Setup GraphQL
        // this.bootstrapApp.setupGraphQL(this.express);
        // Setup routes
        this.bootstrapApp.setupRoutes(this.express);
        // Setup errors
        this.bootstrapApp.setupErrors(this.express);
        // Setup DB
        this.bootstrapApp.setupDatabase(this.express);
        // Setup core tools
        this.bootstrapApp.setupCoreTools(this.express);
        // Setup Heroku ping to prevent free tier sleeping
        this.bootstrapApp.setupHerokuPing(this.express);

        // TODO: add logger (maybe morgan (http)) or custom

        const activeServer = this.bootstrapApp.startServer(this.express);

        // Setup web sockets
        this.bootstrapApp.setupWebSockets(activeServer);

        const server = new Server(activeServer);
        server.use(this.express);
    }
}
