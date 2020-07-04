import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { PWAService } from '../pwa-helper/pwa.service';
import { LocalStorageService } from '../services/storage.service';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {

  snackBarRef: MatSnackBarRef<CookieConsentComponent>;
  get hasAcceptedCookieConsent(): boolean {
    return this.localStorageService.storageData.consent;
  }

  constructor(private snackBar: MatSnackBar,
    private pwaService: PWAService,
    private localStorageService: LocalStorageService) { }

  openCookieConsentSnackBar() {
    if (!this.hasAcceptedCookieConsent) {
      this.snackBarRef = this.snackBar.openFromComponent(CookieConsentComponent, {
        duration: undefined
      });
    }
  }

  acceptCookieConsent() {
    this.localStorageService.setUserStorageData({ consent: true });

    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    // Show PWA Install snackbar
    this.pwaService.openPWAInstallSnackBar();
  }
}
