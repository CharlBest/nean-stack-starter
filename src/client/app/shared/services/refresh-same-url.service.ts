import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// Use this service if you want an event to fire whenever the user
// navigates to the same url that they are on. This is useful in
// scenarios like the home page where if you click on the home icon
// in the navigation bar to expect the page to scroll up and render
// the latest content or at least refresh

@Injectable({
    providedIn: 'any'
})
export class RefreshSameUrlService implements OnDestroy {
    // NB: This service should be provided in the component's providers so that OnDestory gets called
    private routerEventsSubscription: Subscription;
    constructor(private router: Router) { }

    init(onNavigationEnd: () => void) {
        this.router.onSameUrlNavigation = 'reload';

        this.routerEventsSubscription = this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe(() => {
                onNavigationEnd();
            });
    }

    ngOnDestroy() {
        this.router.onSameUrlNavigation = 'ignore';
        if (this.routerEventsSubscription) {
            this.routerEventsSubscription.unsubscribe();
        }
    }
}
