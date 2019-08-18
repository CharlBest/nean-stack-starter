import { ErrorModel } from '@shared/models/shared/error.model';
import { UserTokenModel } from '@shared/models/shared/user-token.model';
import { Language } from '@shared/translate/language.enum';
import { v1 as neo4j } from 'neo4j-driver';

declare module 'express' {
    interface Response {
        locals: ResponseLocals;
    }
}

interface ResponseLocals {
    user: UserTokenModel | null;
    language: Language | null;
    neo4jSession: neo4j.Session;
    error: ErrorModel;
}
