import { Component } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { PWAService } from '../../pwa-helper/pwa.service';
import { LocalStorageService } from '../../services/storage.service';

@Component({
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent {

  constructor(private pwaService: PWAService,
    private localStorageService: LocalStorageService,
    private snackBarRef: MatSnackBarRef<CookieConsentComponent>) { }

  dismiss() {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    this.localStorageService.setUserStorageData({ consent: true });

    // Show PWA Install snackbar
    this.pwaService.openPWAInstallSnackBar();
  }
}
