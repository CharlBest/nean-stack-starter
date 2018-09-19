import { Router } from 'express';

export abstract class BaseRoute {

    router: Router;

    constructor() {
        this.router = Router();
    }

    abstract initRoutes();
}
