import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { ContextMenuComponent } from '../context-menu/context-menu/context-menu.component';
import { RightClickContextMenuComponent } from './right-click-context-menu/right-click-context-menu.component';

@Injectable({
    providedIn: 'root'
})
export class RightClickContextMenuService implements OnDestroy {

    overlayRef: OverlayRef | null;
    private routerEventsSubscription: Subscription;
    private documentClickSubscription: Subscription;

    constructor(private overlay: Overlay,
        private router: Router) {
        this.closeOnNavigate();
    }

    open(event: MouseEvent, contextMenu: ContextMenuComponent): void {
        this.close();

        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo({ x: event.x, y: event.y })
            .withPositions([
                {
                    originX: 'end',
                    originY: 'bottom',
                    overlayX: 'end',
                    overlayY: 'top',
                }
            ]);

        this.overlayRef = this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.close()
        });

        const componentRef = this.overlayRef.attach(new ComponentPortal(RightClickContextMenuComponent));
        componentRef.instance.contextMenu = contextMenu.bottomSheetContextMenu;

        this.documentClickSubscription = fromEvent<MouseEvent>(document, 'click')
            .pipe(
                filter(clickEvent => {
                    const clickTarget = clickEvent.target as HTMLElement;
                    return !!this.overlayRef && !!this.overlayRef.overlayElement && !this.overlayRef.overlayElement.contains(clickTarget);
                }),
                take(1)
            ).subscribe(() => this.close());
    }

    close(): void {
        if (this.documentClickSubscription) {
            this.documentClickSubscription.unsubscribe();
        }

        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }

    private closeOnNavigate(): void {
        // Close on navigate
        this.routerEventsSubscription = this.router.events.pipe(
            filter(routerEvent => routerEvent instanceof NavigationStart),
            tap(() => this.close()),
            take(1)
        ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.documentClickSubscription) {
            this.documentClickSubscription.unsubscribe();
        }

        if (this.routerEventsSubscription) {
            this.routerEventsSubscription.unsubscribe();
        }
    }
}
