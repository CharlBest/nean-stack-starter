import { Language as LanguageType } from '@shared/translate/language.enum';
import { NextFunction, Request, Response } from 'express';

export class Language {
    static setLanguage(req: Request, res: Response, next: NextFunction): void {
        res.locals.language = req.headers['accept-language'] as LanguageType;
        next();
    }
}
