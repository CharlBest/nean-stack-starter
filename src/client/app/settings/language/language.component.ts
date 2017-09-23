import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {

  languages = [
    new Language('en-US', 'English'),
    new Language('af-ZA', 'Afrikaans'),
  ];

  constructor( @Inject(LOCALE_ID) public activeLanguage: string) { }

  ngOnInit() {
  }

  chooseLanguage(language: Language) {
    if (language.code !== this.activeLanguage) {
      document.cookie = `lang=${language.code};path=/`;
      location.reload();
    }
  }

  getCookie(name: string): string {
    const nameLenPlus = (name.length + 1);
    return document.cookie
      .split(';')
      .map(c => c.trim())
      .filter(cookie => {
        return cookie.substring(0, nameLenPlus) === `${name}=`;
      })
      .map(cookie => {
        return decodeURIComponent(cookie.substring(nameLenPlus));
      })[0] || null;
  }
}

class Language {
  code: string;
  title: string;

  constructor(code: 'en-US' | 'af-ZA', title) {
    this.code = code;
    this.title = title;
  }
}
