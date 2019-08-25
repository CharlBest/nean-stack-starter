import { Injectable } from '@angular/core';
import { DialogService } from '../dialog/dialog.service';
import { AuthService } from './auth.service';
import { LocalStorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    private darkThemeClass = 'dark-theme';
    get isDarkTheme(): boolean {
        return this.localStorageService.storageData.darkTheme;
    }

    // Colors
    get primaryColor(): string {
        return window.getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    }

    get accentColor(): string {
        return window.getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
    }

    get warnColor(): string {
        return window.getComputedStyle(document.documentElement).getPropertyValue('--warn-color');
    }

    get backgroundColor(): string {
        return window.getComputedStyle(document.documentElement).getPropertyValue('--background-color');
    }

    get foregroundColor(): string {
        return window.getComputedStyle(document.documentElement).getPropertyValue('--foreground-color');
    }

    // Native Color Scheme
    get isPreferColorSchemeDark(): boolean {
        return this.isPreferColorScheme('dark');
    }

    get isPreferColorSchemeLight(): boolean {
        return this.isPreferColorScheme('light');
    }

    get isPreferColorSchemeNoPreference(): boolean {
        return this.isPreferColorScheme('no-preference');
    }

    get isPreferColorSchemeSupported(): boolean {
        return this.isPreferColorSchemeDark || this.isPreferColorSchemeLight || this.isPreferColorSchemeNoPreference;
    }

    constructor(private dialogService: DialogService,
        private localStorageService: LocalStorageService,
        private authService: AuthService) { }

    init() {
        this.addRemoveDarkThemeClass();

        this.addNativeColorSchemeListener('dark');
        this.addNativeColorSchemeListener('light');

        this.authService.userLoggedInOrLoggedOut.subscribe(() => {
            this.addRemoveDarkThemeClass();
        });
    }

    toggleTheme() {
        this.updateTheme(!this.isDarkTheme);
    }

    private isPreferColorScheme(value: string): boolean {
        return window.matchMedia(`(prefers-color-scheme: ${value})`).matches;
    }

    private updateTheme(value: boolean) {
        this.localStorageService.setUserStorageData({ darkTheme: value });
        this.addRemoveDarkThemeClass();
    }

    private addRemoveDarkThemeClass() {
        const bodyElement = document.querySelector('body');
        if (bodyElement) {
            if (this.isDarkTheme) {
                bodyElement.classList.add(this.darkThemeClass);
            } else {
                bodyElement.classList.remove(this.darkThemeClass);
            }
        } else {
            console.error('Body tag can\'t be found');
        }
    }

    private addNativeColorSchemeListener(colorName: string) {
        // tslint:disable-next-line: deprecation (Safari does not allow addEventListener although addListener is deprecated)
        window.matchMedia(`(prefers-color-scheme: ${colorName})`).addListener(async (event: MediaQueryListEvent) => {
            if (event.matches) {
                const hasConfirmed = await this.dialogService.confirm(`We noticed you changed your theme to ${colorName}.
                 Would you like to change the app\'s theme to ${colorName} as well?`);
                if (hasConfirmed) {
                    this.updateTheme(colorName === 'dark');
                }
            }
        });
    }
}
