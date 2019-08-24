import { Injectable } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { LocalStorageService, StorageKey } from '../services/storage.service';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {

  snackBarRef: MatSnackBarRef<CookieConsentComponent>;

  constructor(private localStorageService: LocalStorageService) { }

  hasAcceptedCookieConsent() {
    const consent = this.localStorageService.getItem(StorageKey.COOKIE_CONSENT);
    return consent !== null && consent !== undefined && consent === 'true';
  }

  acceptCookieConsent() {
    this.localStorageService.setItem(StorageKey.COOKIE_CONSENT, 'true');

    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }
}
