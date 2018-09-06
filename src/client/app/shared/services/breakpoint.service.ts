import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';

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

    ngOnDestroy() {
        this.isDesktopSubject.complete();
    }
}
