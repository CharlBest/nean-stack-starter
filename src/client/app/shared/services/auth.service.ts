import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements CanActivate {
    private readonly tokenStorageKey = 'token';

    private loggedInUserId = new BehaviorSubject<number>(this.getIdFromJWT());
    loggedInUserId$ = this.loggedInUserId.asObservable();

    private _preventLogoutOnNextRequest: boolean;
    get shouldPreventLogoutOnNextRequest() {
        if (this._preventLogoutOnNextRequest) {
            this._preventLogoutOnNextRequest = false;
            return true;
        } else {
            return false;
        }
    }

    constructor(private router: Router,
        private dialog: MatDialog) { }

    private getIdFromJWT() {
        const token = this.getLocalToken();
        if (token) {
            const parsedToken = this.parseJwt(token);
            const id = parsedToken.data.i /* alias for ID */;
            if (id) {
                return +id;
            }
        }
        return null;
    }

    private parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        try {
            return JSON.parse(window.atob(base64));
        } catch (e) {
            console.error('problem with token parsing');
            return null;
        }
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.hasToken()) {
            return true;
        } else {
            this.router.navigate(['login'], { queryParams: { returnUrl: state.url }, queryParamsHandling: 'merge' });
            return false;
        }
    }

    updateLoggedInUserId(value) {
        this.loggedInUserId.next(value);
    }

    getLoggedInUserId(): number {
        return this.loggedInUserId.getValue();
    }

    setToken(accessToken: string, id: number) {
        sessionStorage.setItem(this.tokenStorageKey, accessToken);
        this.updateLoggedInUserId(id);
    }

    removeToken() {
        sessionStorage.clear();
        this.updateLoggedInUserId(null);
        this.router.navigate(['login'], { queryParams: { returnUrl: this.router.url }, queryParamsHandling: 'merge' });
        this.dialog.closeAll();
    }

    hasToken(): boolean {
        const token = sessionStorage.getItem(this.tokenStorageKey);
        return token !== null && token !== undefined;
    }

    getLocalToken(): string {
        return sessionStorage.getItem(this.tokenStorageKey);
    }

    preventLogoutOnNextRequest() {
        this._preventLogoutOnNextRequest = true;
    }
}
