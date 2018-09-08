import { Injectable } from '@angular/core';
import { MatSnackBarRef } from '@angular/material';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {

  private readonly cookieConsentStorageKey = 'cookie_consent';
  snackBarRef: MatSnackBarRef<CookieConsentComponent>;

  constructor() { }

  hasAcceptedCookieConsent() {
    const consent = localStorage.getItem(this.cookieConsentStorageKey);
    return consent !== null && consent !== undefined && consent === 'true';
  }

  acceptCookieConsent() {
    localStorage.setItem(this.cookieConsentStorageKey, 'true');
    this.snackBarRef.dismiss();
  }
}
