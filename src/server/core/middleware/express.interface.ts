import { v1 as neo4j } from 'neo4j-driver';
import { DbQueries } from '../database';

declare module 'express' {
    interface Response {
        locals: ResponseLocals;
        app: {
            locals: {
                dbQueries: DbQueries;
            }
        };
    }
}

interface ResponseLocals {
    user: UserToken | null;
    neo4jSession: neo4j.Session;
    error: Error;
}

interface UserToken {
    i: number; // user ID
    u: string; // username
    r: string; // role
}

interface Error {
    globalErrors: { [key: string]: string };
    formErrors: Array<any>;
}
