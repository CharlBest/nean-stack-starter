import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BreakpointService implements OnDestroy {

    private isWebMediaQueries = [
        Breakpoints.WebLandscape,
        Breakpoints.WebPortrait,
        Breakpoints.TabletLandscape,
        Breakpoints.TabletPortrait
    ];
    private isWebSubject = new BehaviorSubject<boolean>(this.breakpointObserver.isMatched(this.isWebMediaQueries));
    get isWeb(): boolean {
        return this.isWebSubject.value;
    }
    isWeb$ = this.isWebSubject.asObservable().pipe(share());

    constructor(private breakpointObserver: BreakpointObserver) {
        this.breakpointObserver.observe(this.isWebMediaQueries)
            .subscribe(data => {
                if (this.isWebSubject.value !== data.matches) {
                    this.isWebSubject.next(data.matches);
                }
            });
    }

    ngOnDestroy() {
        this.isWebSubject.complete();
    }
}
