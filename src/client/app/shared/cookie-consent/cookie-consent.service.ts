import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {

  private readonly cookieConsentStorageKey = 'cookie-consent';

  constructor(private snackBar: MatSnackBar) { }

  hasAcceptedCookieConsent() {
    const consent = sessionStorage.getItem(this.cookieConsentStorageKey);
    return consent !== null && consent !== undefined && consent === 'true';
  }

  acceptCookieConsent() {
    sessionStorage.setItem(this.cookieConsentStorageKey, 'true');
    // TODO: this will hide all snackbars even ones that suggest taking a tour
    this.snackBar.dismiss();
  }
}