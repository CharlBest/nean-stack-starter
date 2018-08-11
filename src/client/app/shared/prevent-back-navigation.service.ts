import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PreventBackNavigationService {

    constructor(private location: Location) { }

    beforeOpen() {
        history.pushState(null, null, location.href);
        window.onpopstate = () => this.location.forward();
    }

    afterClosed() {
        window.onpopstate = () => { };
    }
}
