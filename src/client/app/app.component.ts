import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { OnboardingService } from './onboarding/onboarding.service';
import { CookieConsentSnackbarService } from './shared/cookie-consent/cookie-consent-snackbar.service';
import { NetworkStatusService } from './shared/network-status/network-status.service';
import { PWAService } from './shared/pwa-helper/pwa.service';
import { ActiveTimerService } from './shared/services/active-timer.service';
import { ASCIIArtService } from './shared/services/ascii-art.service';
import { AuthService } from './shared/services/auth.service';
import { GoogleAnalyticsService } from './shared/services/google-analytics.service';
import { NotificationService } from './shared/services/notification.service';
import { ThemeService } from './shared/services/theme.service';
import { TranslateService } from './shared/translate/translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private authService: AuthService,
    private gaService: GoogleAnalyticsService,
    private themeService: ThemeService,
    private notificationService: NotificationService,
    private asciiArtService: ASCIIArtService,
    private cookieConsentSnackbarService: CookieConsentSnackbarService,
    private networkStatusService: NetworkStatusService,
    private pwaService: PWAService,
    private onboardingService: OnboardingService,
    private activeTimerService: ActiveTimerService,
    private translateService: TranslateService) {
    // Translation (i18n)
    this.translateService.init();

    // Authentication
    this.authService.init();

    // Google Analytics
    this.gaService.init();

    // Activate theme
    this.themeService.init();

    // Activate notifications
    this.notificationService.init();

    // Alert user if they've used the platform for too long
    this.activeTimerService.init();

    // Show onboarding
    if (!this.onboardingService.openOnboarding()) {
      // Show cookie consent
      this.cookieConsentSnackbarService.openCookieConsentSnackBar();
    }

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
