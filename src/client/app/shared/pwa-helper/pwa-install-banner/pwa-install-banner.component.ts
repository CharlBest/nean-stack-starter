import { Component } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { PWAService } from '../pwa.service';

@Component({
  templateUrl: './pwa-install-banner.component.html',
  styleUrls: ['./pwa-install-banner.component.scss']
})
export class PWAInstallBannerComponent {

  constructor(public pwaService: PWAService,
    private snackBarRef: MatSnackBarRef<PWAInstallBannerComponent>) { }

  dismiss(): void {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }
}
