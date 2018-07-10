import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { PWAHelperComponent } from './pwa-helper/pwa-helper.component';

@Injectable()
export class PWAHelperService {

    constructor(private overlay: Overlay) { }

    report(uId: string) {
        const config = new OverlayConfig({
            hasBackdrop: true,
            // backdropClass: 'cdk-overlay-transparent-backdrop',
            positionStrategy: this.overlay.position().global().top().right()
        });

        const overlayRef = this.overlay.create(config);

        overlayRef.backdropClick().subscribe(() => {
            overlayRef.dispose();
        });

        const userProfilePortal = new ComponentPortal(PWAHelperComponent);
        overlayRef.attach(userProfilePortal);
    }
}
