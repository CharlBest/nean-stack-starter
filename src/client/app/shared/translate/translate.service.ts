import { Injectable } from '@angular/core';
import { Language } from '@shared/translate/language.enum';
import { translateService } from '@shared/translate/translate.service';
import { LocalStorageService, StorageKey } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private readonly defaultLanguage = Language.ENGLISH;
  activeLanguage: Language | null;

  constructor(private localStorageService: LocalStorageService) { }

  init() {
    const storedLanguage = this.localStorageService.getItem(StorageKey.LANGUAGE) as Language || this.defaultLanguage;
    this.activeLanguage = storedLanguage || this.defaultLanguage;

    const success = translateService.setLanguage(this.activeLanguage);

    if (success && this.activeLanguage !== storedLanguage) {
      this.saveLanguagePreference(this.activeLanguage);
    }
  }

  saveLanguagePreference(language: Language) {
    this.localStorageService.setItem(StorageKey.LANGUAGE, language);
  }

  refresh() {
    const storedLanguage = this.localStorageService.getItem(StorageKey.LANGUAGE) as Language;
    if (this.activeLanguage !== storedLanguage) {
      this.activeLanguage = storedLanguage || this.defaultLanguage;
      translateService.setLanguage(this.activeLanguage);
    }
  }
}
