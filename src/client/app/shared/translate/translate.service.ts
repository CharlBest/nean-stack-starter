import { Injectable } from '@angular/core';
import { Language } from '@shared/translate/language.enum';
import { translateService } from '@shared/translate/translate.service';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private readonly languageKey = 'language';
  private readonly defaultLanguage = Language.ENGLISH;
  activeLanguage: Language | null;

  constructor() { }

  init() {
    const storedLanguage = localStorage.getItem(this.languageKey) as Language || this.defaultLanguage;
    this.activeLanguage = storedLanguage || this.defaultLanguage;

    const success = translateService.setLanguage(this.activeLanguage);

    if (success && this.activeLanguage !== storedLanguage) {
      this.saveLanguagePreference(this.activeLanguage);
    }
  }

  saveLanguagePreference(language: Language) {
    localStorage.setItem(this.languageKey, language);
  }
}
