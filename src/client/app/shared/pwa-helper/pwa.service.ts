import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PWAService {

    beforeInstallPromptEvent: Event;

    constructor() { }

    init() {
        this.addEventForBeforeInstallPrompt();
    }

    private addEventForBeforeInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (beforeInstallPromptEvent) => {
            // Prevents immediate prompt display
            beforeInstallPromptEvent.preventDefault();
            this.beforeInstallPromptEvent = beforeInstallPromptEvent;
        });
    }

    openInstallPrompt() {
        if (this.beforeInstallPromptEvent) {
            (this.beforeInstallPromptEvent as any).prompt();
        }
    }
}
