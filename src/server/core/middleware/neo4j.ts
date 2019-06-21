import { NextFunction, Request, Response } from 'express';
import { Database } from '../database';

export class Neo4j {

    static sessionSetup(req: Request, res: Response, next: NextFunction): void {
        if (!res.locals.neo4jSession) {
            res.locals.neo4jSession = Database.createSession();
        }
        next();
    }

    static sessionCleanup(req: Request, res: Response, next: NextFunction): void {
        res.on('finish', () => {
            if (res.locals.neo4jSession) {
                res.locals.neo4jSession.close();
                delete res.locals.neo4jSession;
            }
        });
        next();
    }
}
