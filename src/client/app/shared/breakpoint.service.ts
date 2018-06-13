import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable()
export class BreakpointService implements OnDestroy {

    private _isWebMediaQueries = [
        Breakpoints.WebLandscape,
        Breakpoints.WebPortrait,
        Breakpoints.TabletLandscape,
        Breakpoints.TabletPortrait
    ];
    private _isWebSubject = new BehaviorSubject<boolean>(this._breakpointObserver.isMatched(this._isWebMediaQueries));
    get isWeb(): boolean {
        return this._isWebSubject.value;
    }
    isWeb$ = this._isWebSubject.asObservable().pipe(share());

    constructor(private _breakpointObserver: BreakpointObserver) {
        this._breakpointObserver.observe(this._isWebMediaQueries).subscribe(data => {
            if (this._isWebSubject.value !== data.matches) {
                this._isWebSubject.next(data.matches);
            }
        })
    }

    ngOnDestroy() {
        this._isWebSubject.complete();
    }
}
