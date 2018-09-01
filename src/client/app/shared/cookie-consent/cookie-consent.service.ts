import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {

  private readonly cookieConsentStorageKey = 'cookie_consent';

  constructor(private snackBar: MatSnackBar) { }

  hasAcceptedCookieConsent() {
    const consent = localStorage.getItem(this.cookieConsentStorageKey);
    return consent !== null && consent !== undefined && consent === 'true';
  }

  acceptCookieConsent() {
    localStorage.setItem(this.cookieConsentStorageKey, 'true');
    // TODO: this will hide all snackbars even ones that suggest taking a tour
    this.snackBar.dismiss();
  }
}
