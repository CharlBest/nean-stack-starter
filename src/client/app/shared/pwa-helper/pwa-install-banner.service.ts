import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PWAInstallBannerComponent } from './pwa-install-banner/pwa-install-banner.component';
import { PWAService } from './pwa.service';

@Injectable({
    providedIn: 'root',
})
export class PWAInstallBannerService {

    constructor(private pwaService: PWAService,
        private snackBar: MatSnackBar) { }

    openPWAInstallSnackBar(): void {
        if (this.pwaService.canInstallAndNotInPWA) {
            this.snackBar.openFromComponent(PWAInstallBannerComponent, {
                duration: undefined
            });
        }
    }
}
