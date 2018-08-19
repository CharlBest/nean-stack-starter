import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements CanActivate {
    private tokeyKey = 'token';

    private loggedInUserId = new BehaviorSubject<number>(this.getIdFromJWT());
    loggedInUserId$ = this.loggedInUserId.asObservable();

    constructor(private router: Router,
        private dialog: MatDialog) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.hasToken()) {
            return true;
        } else {
            this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }

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

    parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        try {
            return JSON.parse(window.atob(base64));
        } catch (e) {
            console.error('problem with token parsing');
            return null;
        }
    }

    public updateLoggedInUserId(value) {
        this.loggedInUserId.next(value);
    }

    public getLoggedInUserId(): number {
        return this.loggedInUserId.getValue();
    }

    public setToken(accessToken: string, id: number) {
        sessionStorage.setItem(this.tokeyKey, accessToken);
        this.updateLoggedInUserId(id);
    }

    public removeToken() {
        sessionStorage.clear();
        this.updateLoggedInUserId(null);
        this.router.navigate(['login'], { queryParams: { returnUrl: this.router.url } });
        this.dialog.closeAll();
    }

    public hasToken(): boolean {
        const token = sessionStorage.getItem(this.tokeyKey);
        return token != null;
    }

    public getLocalToken(): string {
        return sessionStorage.getItem(this.tokeyKey);
    }
}
