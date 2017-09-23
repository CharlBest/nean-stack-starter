import { Request, Response, NextFunction } from 'express';

export class Neo4j {
    static sessionCleanup(req: Request | any, res: Response, next: NextFunction): void {
        res.on('finish', () => {
            if (req.neo4jSession) {
                req.neo4jSession.close();
                delete req.neo4jSession;
            }
        });
        next();
    }
}
