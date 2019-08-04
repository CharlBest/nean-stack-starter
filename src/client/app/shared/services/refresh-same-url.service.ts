import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
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
