import { Response } from 'express';
import { Language } from './language.enum';
import { afrikaans } from './languages/afrikaans';
import { english } from './languages/english';
import { TranslateKey, TranslateTerm } from './translate-term.interface';

class TranslateService {

    private activeLanguage: TranslateTerm;
    get getActiveLanguage(): TranslateTerm {
        return this.activeLanguage;
    }

    // Client
    t(key: TranslateKey, params?: TranslateParams) {
        if (params) {
            return this.replacePlaceholders(this.activeLanguage[key], params) || this.keyNotFound(key);
        } else {
            return this.activeLanguage[key] || this.keyNotFound(key);
        }
    }

    // Server - prevent using this. Rather send key to client and render text there.
    ts(res: Response, key: TranslateKey, params?: TranslateParams) {
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

    getLanguagePack(language: Language | null) {
        switch (language) {
            case Language.ENGLISH:
                return english;

            case Language.AFRIKAANS:
                return afrikaans;

            default:
                console.error('Language could not be found');
                return null;
        }
    }

    setLanguage(language: Language | null): boolean {
        const pack = this.getLanguagePack(language);
        if (pack) {
            this.activeLanguage = pack;
            return true;
        } else {
            return false;
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

    doesLanguageKeyExist(key: string) {
        return Object.values(Language).includes(key);
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
