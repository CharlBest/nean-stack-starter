import * as express from 'express';
import { NextFunction, Request, Response, Router } from 'express';
import { verify } from 'jsonwebtoken';
import { environment } from '../../environments/environment';

export abstract class BaseRoute {

    router: Router;

    constructor() {
        this.router = express.Router();
    }

    abstract initRoutes();
}
