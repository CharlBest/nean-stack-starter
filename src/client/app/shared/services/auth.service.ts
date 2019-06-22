import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserTokenModel } from '../../../../shared/models/shared/user-token.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements CanActivate {
    private readonly tokenStorageKey = 'token';

    private loggedInUserId = new BehaviorSubject<number | null>(0);
    loggedInUserId$ = this.loggedInUserId.asObservable();

    private preventLogoutOnNextRequestFlag: boolean;
    get shouldPreventLogoutOnNextRequest() {
        if (this.preventLogoutOnNextRequestFlag) {
            this.preventLogoutOnNextRequestFlag = false;
            return true;
        } else {
            return false;
        }
    }
    private tokenExpireDateInSeconds: number | null;

    constructor(private router: Router,
        private dialog: MatDialog) { }

    private getDataFromJWT(): { id: number | null, expireDate: number | null } {
        const token = this.getLocalToken();

        if (token) {
            const parsedToken = this.parseJwt(token) as { data: UserTokenModel, exp: number };

            const id = +parsedToken.data.i /* alias for ID */;
            const expireDate = +parsedToken.exp;

            return { id, expireDate };
        }

        return { id: null, expireDate: null };
    }

    private parseJwt(token: string) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        try {
            return JSON.parse(window.atob(base64));
        } catch (e) {
            console.error('problem with token parsing');
            return null;
        }
    }

    init() {
        this.updateLoggedInUser();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.hasToken() || this.router.navigate(['login'], { queryParams: { returnUrl: state.url }, queryParamsHandling: 'merge' });
    }

    updateLoggedInUser() {
        const { id, expireDate } = this.getDataFromJWT();
        this.loggedInUserId.next(id);
        this.tokenExpireDateInSeconds = expireDate;
    }

    getLoggedInUserId(): number | null {
        return this.loggedInUserId.getValue();
    }

    setToken(token: string) {
        sessionStorage.setItem(this.tokenStorageKey, token);
        this.updateLoggedInUser();
    }

    removeToken() {
        sessionStorage.removeItem(this.tokenStorageKey);
        this.updateLoggedInUser();
    }

    removeTokenAndNavigateToLogin() {
        this.removeToken();
        this.router.navigate(['login'], { queryParams: { returnUrl: this.router.url }, queryParamsHandling: 'merge' });
        this.dialog.closeAll();
    }

    hasToken(): boolean {
        const token = this.getLocalToken();
        return token !== null && token !== undefined;
    }

    getLocalToken(): string | null {
        return sessionStorage.getItem(this.tokenStorageKey);
    }

    preventLogoutOnNextRequest() {
        this.preventLogoutOnNextRequestFlag = true;
    }

    hasTokenExpired() {
        if (this.tokenExpireDateInSeconds && this.hasToken() && Math.floor(Date.now() / 1000) >= this.tokenExpireDateInSeconds) {
            return true;
        } else {
            return false;
        }
    }
}
