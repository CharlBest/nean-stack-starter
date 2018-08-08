import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private isDarkThemeStorageKey = 'is_dark_theme';
    private darkThemeClass = 'dark-theme';
    private darkTheme: boolean;
    get isDarkTheme(): boolean {
        return this.darkTheme;
    }

    constructor() {
        this.themeOnInit();
    }

    private themeOnInit() {
        this.darkTheme = localStorage.getItem(this.isDarkThemeStorageKey) === 'true';
        this.updateTheme();
    }

    private updateTheme() {
        if (this.darkTheme) {
            document.querySelector('body').classList.add(this.darkThemeClass);
        } else {
            document.querySelector('body').classList.remove(this.darkThemeClass);
        }

        localStorage.setItem(this.isDarkThemeStorageKey, `${this.darkTheme}`);
    }

    toggleTheme() {
        this.darkTheme = !this.darkTheme;
        this.updateTheme();
    }
}