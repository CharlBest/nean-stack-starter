import { Injectable } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { TutorialService } from '../tutorial/tutorial.service';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {

  private readonly cookieConsentStorageKey = 'cookie_consent';
  snackBarRef: MatSnackBarRef<CookieConsentComponent>;

  constructor(private tutorialService: TutorialService) { }

  hasAcceptedCookieConsent() {
    const consent = localStorage.getItem(this.cookieConsentStorageKey);
    return consent !== null && consent !== undefined && consent === 'true';
  }

  acceptCookieConsent() {
    localStorage.setItem(this.cookieConsentStorageKey, 'true');
    this.snackBarRef.dismiss();
    this.tutorialService.checkHasVisited();
  }
}
