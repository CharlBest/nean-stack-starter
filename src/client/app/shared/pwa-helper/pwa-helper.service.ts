import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { PWAHelperComponent } from './pwa-helper/pwa-helper.component';

@Injectable({
    providedIn: 'root'
})
export class PWAHelperService implements OnDestroy {

    private routerEventsSubscription: Subscription;

    constructor(private overlay: Overlay,
        private router: Router) { }

    open(): void {
        const config = new OverlayConfig({
            hasBackdrop: true,
            // backdropClass: 'cdk-overlay-transparent-backdrop',
            positionStrategy: this.overlay.position().global().top().right()
        });

        const overlayRef = this.overlay.create(config);

        overlayRef.backdropClick().subscribe(() => {
            overlayRef.dispose();
        });

        // Close on navigate
        this.routerEventsSubscription = this.router.events.pipe(
            filter(event => event instanceof NavigationStart),
            tap(() => overlayRef.dispose()),
            take(1)
        ).subscribe();

        const userProfilePortal = new ComponentPortal(PWAHelperComponent);
        overlayRef.attach(userProfilePortal);
    }

    ngOnDestroy(): void {
        if (this.routerEventsSubscription) {
            this.routerEventsSubscription.unsubscribe();
        }
    }
}
