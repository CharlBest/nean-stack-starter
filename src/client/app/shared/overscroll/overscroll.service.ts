import { EventEmitter, Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OverscrollService {

    startY: number;
    isProcessing = false;
    readonly overscrolled: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
        fromEvent<TouchEvent>(document, 'touchstart', { passive: true }).subscribe((event: TouchEvent) => {
            this.startY = event.touches[0].pageY;
        });

        fromEvent<TouchEvent>(document, 'touchmove', { passive: true }).subscribe((event: TouchEvent) => {
            // Activate custom pull-to-refresh effects when at the top of the container and user is scrolling up.
            if (document?.scrollingElement?.scrollTop === 0 && event.touches[0].pageY > this.startY && !this.isProcessing) {
                this.isProcessing = true;
                this.overscrolled.emit();
            }
        });

        fromEvent<TouchEvent>(document, 'touchend', { passive: true }).subscribe((event: TouchEvent) => {
            this.isProcessing = false;
        });
    }
}
