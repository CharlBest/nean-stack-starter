import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CookieConsentService } from '../../shared/cookie-consent/cookie-consent.service';
import { ThemeService } from '../../shared/services/theme.service';

@Component({
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements AfterViewInit, OnDestroy {

    selectedIndex = 0;
    tabs: Array<number>;
    isDarkThemeOnLoad = this.themeService.isDarkTheme;


    constructor(private changeDetectorRef: ChangeDetectorRef,
        private cookieConsentService: CookieConsentService,
        public themeService: ThemeService) { }

    ngAfterViewInit(): void {
        this.generateBubbles();
    }

    generateBubbles(): void {
        const matTabs = document.getElementsByTagName('mat-tab-body');

        const tabs = [];
        for (let i = 0; i < matTabs.length; i++) {
            tabs.push(i);
        }

        this.tabs = tabs;
        this.changeDetectorRef.detectChanges();
    }

    previous(): void {
        if (this.selectedIndex > 0) {
            this.selectedIndex = this.selectedIndex - 1;
        }
    }

    next(): void {
        if (this.selectedIndex < this.tabs.length - 1) {
            this.selectedIndex = this.selectedIndex + 1;
        }
    }

    trackByFn(index: number, item: string): number {
        return index;
    }

    ngOnDestroy(): void {
        this.cookieConsentService.openCookieConsentSnackBar();
    }
}
