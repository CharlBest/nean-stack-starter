import { Language as LanguageType } from '@shared/translate/language.enum';
import { NextFunction, Request, Response } from 'express';

export class Language {
    static setLanguage(req: Request, res: Response, next: NextFunction): void {
        let language = req.headers['accept-language'];
        if (language && language.length >= 2) {
            language = language.substr(0, 2);
            res.locals.language = language as LanguageType;
        }
        next();
    }
}
