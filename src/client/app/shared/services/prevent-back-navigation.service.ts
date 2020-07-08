import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

// Use this service to prevent the user from navigating back
// This can be useful if there is a dialog, menu or bottom sheet open
// and want it to close by navigating back. This is the expected behaviour
// especially on mobile where you don't want to go back a page but just close
// the overlay blocking the page in the background

@Injectable({
    providedIn: 'root'
})
export class PreventBackNavigationService {

    constructor(private location: Location) { }

    beforeOpen(): void {
        history.pushState(null, '', location.href);
        window.onpopstate = () => this.location.forward();
    }

    afterClosed(): void {
        window.onpopstate = () => { };
    }
}
