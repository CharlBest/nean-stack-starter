import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatTab } from '@angular/material/tabs';
import { TutorialType } from '@shared/view-models/tutorial/tutorial-type.enum';
import { CookieConsentSnackbarService } from '../../shared/cookie-consent/cookie-consent-snackbar.service';
import { CookieConsentService } from '../../shared/cookie-consent/cookie-consent.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { PWAService } from '../../shared/pwa-helper/pwa.service';
import { ThemeService } from '../../shared/services/theme.service';
import { TutorialService } from '../../shared/tutorial/tutorial.service';

@Component({
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChildren(MatTab) matTabList: QueryList<MatTab>;
    numberOfTabs: number;
    selectedIndex = 0;
    bubbles: Array<number>;
    hasAcceptedCookieConsentOnLoad = this.cookieConsentService.hasAcceptedCookieConsent;
    hasAcceptedCookieConsent = this.hasAcceptedCookieConsentOnLoad;
    isDarkThemeOnLoad = this.themeService.isDarkTheme;
    showInstallBannerOnLoad = this.navigationService.showInstallBanner;

    constructor(public cookieConsentService: CookieConsentService,
        private cookieConsentSnackbarService: CookieConsentSnackbarService,
        public pwaService: PWAService,
        public themeService: ThemeService,
        private tutorialService: TutorialService,
        private changeDetectorRef: ChangeDetectorRef,
        private navigationService: NavigationService) { }

    ngOnInit() {
        // When using back nav bar after onboarding go to home
        this.navigationService.backRouterPath = '/';

        // Hide install banner if it's showing
        this.navigationService.showInstallBanner = false;

        // Watch for before install prompt to show install banner
        this.pwaService.beforeInstallPromptChange.subscribe(() => {
            if (this.pwaService.canInstallAndNotInPWA) {
                this.navigationService.showInstallBanner = false;
                this.showInstallBannerOnLoad = true;
            }
        });
    }

    ngAfterViewInit() {
        this.numberOfTabs = this.matTabList.length;

        const bubbles = [];
        for (let i = 0; i < this.numberOfTabs; i++) {
            bubbles.push(i);
        }

        this.bubbles = bubbles;
        this.changeDetectorRef.detectChanges();
    }

    previous() {
        if (this.selectedIndex > 0) {
            this.selectedIndex = this.selectedIndex - 1;
        }
    }

    next() {
        if (this.selectedIndex < this.numberOfTabs - 1) {
            this.selectedIndex = this.selectedIndex + 1;
        }
    }

    acceptCookieConsent() {
        this.hasAcceptedCookieConsent = true;
        this.cookieConsentService.acceptCookieConsent();
        this.selectedIndex++;
    }

    takeTour() {
        this.tutorialService.activateTutorial(TutorialType.SIGN_UP);
    }

    ngOnDestroy() {
        this.cookieConsentSnackbarService.openCookieConsentSnackBar();
        this.navigationService.showInstallBanner = this.showInstallBannerOnLoad;
    }
}
