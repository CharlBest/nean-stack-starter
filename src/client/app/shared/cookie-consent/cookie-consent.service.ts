import { Injectable } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { LocalStorageService } from '../services/storage.service';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {

  get hasAcceptedCookieConsent(): boolean {
    return this.localStorageService.storageData.consent;
  }

  snackBarRef: MatSnackBarRef<CookieConsentComponent>;

  constructor(private localStorageService: LocalStorageService) { }

  acceptCookieConsent() {
    this.localStorageService.setUserStorageData({ consent: true });

    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }
}
