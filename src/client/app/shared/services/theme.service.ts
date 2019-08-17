import { Injectable } from '@angular/core';
import { DialogService } from '../dialog/dialog.service';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private isDarkThemeStorageKey = 'is_dark_theme';
    private darkThemeClass = 'dark-theme';
    private darkTheme: boolean = localStorage.getItem(this.isDarkThemeStorageKey) === 'true';
    get isDarkTheme(): boolean {
        return this.darkTheme;
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

    constructor(private dialogService: DialogService) { }

    init() {
        this.updateTheme();
        this.addNativeColorSchemeListener('dark');
        this.addNativeColorSchemeListener('light');
    }

    toggleTheme() {
        this.darkTheme = !this.darkTheme;
        this.updateTheme();
    }

    private isPreferColorScheme(value: string): boolean {
        return window.matchMedia(`(prefers-color-scheme: ${value})`).matches;
    }

    private updateTheme() {
        const bodyElement = document.querySelector('body');
        if (bodyElement) {
            if (this.darkTheme) {
                bodyElement.classList.add(this.darkThemeClass);
            } else {
                bodyElement.classList.remove(this.darkThemeClass);
            }
        } else {
            console.error('Body tag can\'t be found');
        }

        localStorage.setItem(this.isDarkThemeStorageKey, `${this.darkTheme}`);
    }

    private addNativeColorSchemeListener(colorName: string) {
        window.matchMedia(`(prefers-color-scheme: ${colorName})`).addEventListener('change', async (event: MediaQueryListEvent) => {
            if (event.matches) {
                const hasConfirmed = await this.dialogService.confirm(`We noticed you changed your theme to ${colorName}.
                 Would you like to change the app\'s theme to ${colorName} as well?`);
                if (hasConfirmed) {
                    this.darkTheme = colorName === 'dark';
                    this.updateTheme();
                }
            }
        });
    }
}
