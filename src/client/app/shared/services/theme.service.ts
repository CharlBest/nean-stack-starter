import { Injectable } from '@angular/core';

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

    init() {
        this.updateTheme();
    }

    toggleTheme() {
        this.darkTheme = !this.darkTheme;
        this.updateTheme();
    }
}
