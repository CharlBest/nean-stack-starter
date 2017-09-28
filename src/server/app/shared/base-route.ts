import * as express from 'express';
import { NextFunction, Request, Response, Router } from 'express';
import { verify } from 'jsonwebtoken';

export abstract class BaseRoute {

    router: Router;

    constructor() {
        this.router = express.Router();
    }

    abstract initRoutes();
}
