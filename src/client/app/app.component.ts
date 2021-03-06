import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { OnboardingService } from './onboarding/onboarding.service';
import { CookieConsentService } from './shared/cookie-consent/cookie-consent.service';
import { NetworkStatusService } from './shared/network-status/network-status.service';
import { PWAService } from './shared/pwa-helper/pwa.service';
import { ActiveTimerService } from './shared/services/active-timer.service';
import { AnalyticsService } from './shared/services/analytics.service';
import { ASCIIArtService } from './shared/services/ascii-art.service';
import { AuthService } from './shared/services/auth.service';
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
    private analyticsService: AnalyticsService,
    private themeService: ThemeService,
    private notificationService: NotificationService,
    private asciiArtService: ASCIIArtService,
    private cookieConsentService: CookieConsentService,
    private networkStatusService: NetworkStatusService,
    private pwaService: PWAService,
    private onboardingService: OnboardingService,
    private activeTimerService: ActiveTimerService,
    private translateService: TranslateService) {
    // Analytics
    this.analyticsService.init();

    // Authentication
    this.authService.init();

    // Translation (i18n)
    this.translateService.init();

    // Activate theme
    this.themeService.init();

    // Activate notifications
    this.notificationService.init();

    // Alert user if they've used the platform for too long
    this.activeTimerService.init();

    // Show onboarding
    if (!this.onboardingService.openOnboarding()) {
      // Show cookie consent
      this.cookieConsentService.openCookieConsentSnackBar();
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
