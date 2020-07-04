import { EventEmitter, Injectable } from '@angular/core';
import { DialogService } from '../dialog/dialog.service';

@Injectable({
    providedIn: 'root',
})
export class PWAService {

    readonly beforeInstallPromptChange: EventEmitter<void> = new EventEmitter<void>();
    private beforeInstallPromptEvent: Event;
    get canInstallAndNotInPWA(): boolean {
        return !!this.beforeInstallPromptEvent && !this.isWithinPWA;
    }
    readonly isWithinPWA: boolean = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true; // Safari workaround

    constructor(private dialogService: DialogService) { }

    init() {
        this.addEventForBeforeInstallPrompt();
        this.addListenerForAppInstalled();
    }

    openInstallPrompt() {
        if (this.beforeInstallPromptEvent) {
            (this.beforeInstallPromptEvent as any /*BeforeInstallPromptEvent*/).prompt();
        }
    }

    // TODO: show install banner after 1 week and ask to dismiss again. Wait until user navigates to prevent accidental click on bar
    // private trackNavigationCount() {
    //   let count = 0;
    //   this.routerEventsSubscription = this.router.events
    //     .subscribe(event => {
    //       if (event instanceof NavigationEnd) {
    //         count++;
    //         // Show banner when you have at least navigated 3 times
    //         if (count === 3 && this.pwaService.canInstallAndNotInPWA) {
    //           this.updateInstallBanner(true);
    //         }
    //       }
    //     });
    // }

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
            this.dialogService.alert({
                body: 'Your app was successfully installed'
            });
        });
    }
}
