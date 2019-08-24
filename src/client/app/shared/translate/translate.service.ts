import { Injectable } from '@angular/core';
import { Language } from '@shared/translate/language.enum';
import { translateService } from '@shared/translate/translate.service';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private readonly defaultLanguage = Language.ENGLISH;
  activeLanguage: Language | null;

  constructor(private localStorageService: LocalStorageService,
    private authService: AuthService) { }

  init() {
    const storedLanguage = this.localStorageService.storageData.language as Language;
    this.activeLanguage = storedLanguage || this.defaultLanguage;

    const success = translateService.setLanguage(this.activeLanguage);

    if (success && this.activeLanguage !== storedLanguage) {
      this.saveLanguagePreference(this.activeLanguage);
    }

    this.authService.userLoggedInOrLoggedOut.subscribe(() => {
      this.refresh();
    });
  }

  saveLanguagePreference(language: Language) {
    this.localStorageService.setUserStorageData({ language });
  }

  refresh() {
    const storedLanguage = this.localStorageService.storageData.language as Language | null;
    if (this.activeLanguage !== storedLanguage) {
      this.activeLanguage = storedLanguage || this.defaultLanguage;
      translateService.setLanguage(this.activeLanguage);
    }
  }
}
