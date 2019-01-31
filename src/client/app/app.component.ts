import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { CookieConsentSnackbarService } from './shared/cookie-consent/cookie-consent-snackbar.service';
import { NetworkStatusService } from './shared/network-status/network-status.service';
import { PWAService } from './shared/pwa-helper/pwa.service';
import { ASCIIArtService } from './shared/services/ascii-art.service';
import { AuthService } from './shared/services/auth.service';
import { GaService } from './shared/services/ga.service';
import { NotificationService } from './shared/services/notification.service';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private authService: AuthService,
    private gaService: GaService,
    private themeService: ThemeService,
    private notificationService: NotificationService,
    private asciiArtService: ASCIIArtService,
    private cookieConsentSnackbarService: CookieConsentSnackbarService,
    private networkStatusService: NetworkStatusService,
    private pwaService: PWAService) {
    // Authentication
    this.authService.init();

    // Google Analytics
    this.gaService.init();

    // Activate theme
    this.themeService.init();

    // Activate notifications
    this.notificationService.init();

    // Show cookie consent
    this.cookieConsentSnackbarService.openCookieConsentSnackBar();

    // ASCII Art
    this.asciiArtService.slant();

    // Initialize network status event
    this.networkStatusService.init();

    // Start PWA helper (needed for before intall prompt event)
    this.pwaService.init();

    // Firebase
    initializeApp({
      storageBucket: environment.firebase.storageBucket
    }, environment.firebase.projectId);
  }
}
