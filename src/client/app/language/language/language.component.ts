import { Component } from '@angular/core';
import { Language } from '@shared/translate/language.enum';
import { TranslateService } from '../../shared/translate/translate.service';
import { LanguageItem } from './language-item.model';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent {

  languages = [
    new LanguageItem(Language.ENGLISH, 'English'),
    new LanguageItem(Language.AFRIKAANS, 'Afrikaans'),
  ];

  constructor(public translateService: TranslateService) { }

  chooseLanguage(language: Language): void {
    this.translateService.saveLanguagePreference(language);
    window.location.reload();
  }

  trackByFn(index: number, language: LanguageItem): number {
    return index;
  }
}
