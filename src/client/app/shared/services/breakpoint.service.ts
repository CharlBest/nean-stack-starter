import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';

// Use this service if you can to detect if the user is using a
// mobile or desktop. Useful for showing and hiding things in the
// UI that is specific for that platform like native share functionality
// on mobile

@Injectable({
    providedIn: 'root'
})
export class BreakpointService implements OnDestroy {

    private isDesktopMediaQueries = [
        Breakpoints.WebLandscape,
        Breakpoints.WebPortrait,
        Breakpoints.TabletLandscape,
        Breakpoints.TabletPortrait
    ];
    private isDesktopSubject = new BehaviorSubject<boolean>(this.breakpointObserver.isMatched(this.isDesktopMediaQueries));
    get isDesktop(): boolean {
        return this.isDesktopSubject.value;
    }
    isDesktop$ = this.isDesktopSubject.asObservable().pipe(share());

    constructor(private breakpointObserver: BreakpointObserver) {
        this.breakpointObserver.observe(this.isDesktopMediaQueries)
            .subscribe(data => {
                if (this.isDesktopSubject.value !== data.matches) {
                    this.isDesktopSubject.next(data.matches);
                }
            });
    }

    ngOnDestroy(): void {
        this.isDesktopSubject.complete();
    }
}
