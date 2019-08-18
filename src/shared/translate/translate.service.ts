import { Response } from 'express';
import { Language as LanguageType } from './language.enum';
import { Language } from './language.interface';
import { afrikaans } from './languages/afrikaans';
import { english } from './languages/english';

class TranslateService {

    // TODO: MessageFormat Support for pluralization and gender
    // TODO: Converted account module, activity module, home module
    // TODO: save language preference to db
    // TODO: websockets have no idea which language the user is (rather send key than the message itself - more lightweight anyway)

    private activeLanguage: Language;
    get getActiveLanguage(): Language {
        return this.activeLanguage;
    }

    getLanguagePack(language: LanguageType | null) {
        if (language === LanguageType.ENGLISH) {
            return english;
        } else if (language === LanguageType.AFRIKAANS) {
            return afrikaans;
        } else {
            console.error('Language could not be found');
            return null;
        }
    }

    setLanguage(language: LanguageType | null): boolean {
        const pack = this.getLanguagePack(language);
        if (pack) {
            this.activeLanguage = pack;
            return true;
        } else {
            return false;
        }
    }

    // Client
    t(key: keyof Language, params?: TranslateParams) {
        if (params) {
            return this.replacePlaceholders(this.activeLanguage[key], params) || this.keyNotFound(key);
        } else {
            return this.activeLanguage[key] || this.keyNotFound(key);
        }
    }

    // Server - prevent using this. Rather send key to client and render text there.
    ts(res: Response, key: keyof Language, params?: TranslateParams) {
        const pack = this.getLanguagePack(res.locals.language);
        if (!pack) {
            console.error('Language could not be found');
            return `***${res.locals.language}***`;
        }

        if (params) {
            return this.replacePlaceholders(pack[key], params) || this.keyNotFound(key);
        } else {
            return pack[key] || this.keyNotFound(key);
        }
    }

    replacePlaceholders(value: string, params?: TranslateParams) {
        if (value) {
            for (const param in params) {
                if (params.hasOwnProperty(param) && params[param]) {
                    value = value.replace(`{{${param}}}`, params[param].toString());
                }
            }
            return value;
        } else {
            return null;
        }
    }

    private keyNotFound(key: string) {
        console.error('Language key could not be found');
        return `***${key}***`;
    }
}

export const translateService = new TranslateService();

export interface TranslateParams {
    [param: string]: string | number;
}
