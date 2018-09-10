import * as express from 'express';

export abstract class BaseRoute {

    router: express.Router;

    constructor() {
        this.router = express.Router();
    }

    abstract initRoutes();
}
