import { EventEmitter, Injectable, Output } from '@angular/core';
import { DialogService } from '../dialog/dialog.service';
import { NavigationService } from '../navigation/navigation.service';

@Injectable({
    providedIn: 'root',
})
export class PWAService {

    @Output() beforeInstallPromptChange: EventEmitter<void> = new EventEmitter<void>();
    private beforeInstallPromptEvent: Event;
    get canInstallAndNotInPWA(): boolean {
        return !!this.beforeInstallPromptEvent && !this.isWithinPWA;
    }
    readonly isWithinPWA: boolean = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true; // Safari workaround

    constructor(private dialogService: DialogService,
        private navigationService: NavigationService) { }

    init() {
        this.addEventForBeforeInstallPrompt();
        this.addListenerForAppInstalled();
    }

    openInstallPrompt() {
        if (this.beforeInstallPromptEvent) {
            (this.beforeInstallPromptEvent as any /*BeforeInstallPromptEvent*/).prompt();
        }
    }

    private addEventForBeforeInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (beforeInstallPromptEvent) => {
            // Prevents immediate prompt display
            beforeInstallPromptEvent.preventDefault();
            this.beforeInstallPromptEvent = beforeInstallPromptEvent;
            this.beforeInstallPromptChange.emit();
        });
    }

    private addListenerForAppInstalled() {
        window.addEventListener('appinstalled', (event) => {
            this.navigationService.showInstallBanner = false;
            this.dialogService.alert('Your app was successfully installed');
        });
    }
}
