import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PWAService {

    @Output() beforeInstallPromptChange: EventEmitter<void> = new EventEmitter<void>();
    private beforeInstallPromptEvent: Event;
    get canInstallAndNotInPWA(): boolean {
        return !!this.beforeInstallPromptEvent && !this.isWithinPWA;
    }
    readonly isWithinPWA: boolean = window.matchMedia('(display-mode: standalone)').matches;

    init() {
        this.addEventForBeforeInstallPrompt();
    }

    private addEventForBeforeInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (beforeInstallPromptEvent) => {
            // Prevents immediate prompt display
            beforeInstallPromptEvent.preventDefault();
            this.beforeInstallPromptEvent = beforeInstallPromptEvent;
            this.beforeInstallPromptChange.emit();
        });
    }

    openInstallPrompt() {
        if (this.beforeInstallPromptEvent) {
            (this.beforeInstallPromptEvent as any).prompt();
        }
    }
}
