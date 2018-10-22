import { v1 as neo4j } from 'neo4j-driver';
import { ErrorModel } from '../../../shared/models/shared/error.model';
import { UserTokenModel } from '../../../shared/models/shared/user-token.model';

declare module 'express' {
    interface Response {
        locals: ResponseLocals;
    }
}

interface ResponseLocals {
    user: UserTokenModel | null;
    neo4jSession: neo4j.Session;
    error: ErrorModel;
}
