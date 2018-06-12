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
    private _isWebSnapshot = this._breakpointObserver.isMatched(this._isWebMediaQueries);
    private _isWebSubject = new BehaviorSubject<boolean>(this._isWebSnapshot);
    isWeb$ = this._isWebSubject.asObservable().pipe(share());

    constructor(private _breakpointObserver: BreakpointObserver) {
        this._breakpointObserver.observe(this._isWebMediaQueries).subscribe(data => {
            if (this._isWebSnapshot !== data.matches) {
                this._isWebSubject.next(this._isWebSnapshot = data.matches);
            }
        })
    }

    ngOnDestroy() {
        this._isWebSubject.complete();
    }
}
