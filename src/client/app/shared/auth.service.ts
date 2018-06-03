import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService implements CanActivate {
    private tokeyKey = 'token';

    private loggedInUserId = new BehaviorSubject<number>(this.getIdFromJWT());
    loggedInUserId$ = this.loggedInUserId.asObservable();

    constructor(private router: Router) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.checkLogin()) {
            return true;
        } else {
            this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }

    private getIdFromJWT() {
        const token = this.getLocalToken();
        if (token !== null) {
            const parsedToken = this.parseJwt(token);
            const id = parsedToken.data.id;
            if (id !== null && id !== undefined) {
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
    }

    public checkLogin(): boolean {
        const token = sessionStorage.getItem(this.tokeyKey);
        return token != null;
    }

    public getLocalToken(): string {
        return sessionStorage.getItem(this.tokeyKey);
    }

    private initAuthHeaders(): Headers {
        const token = this.getLocalToken();
        if (token == null) {
            throw new Error('No token');
        }

        const headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Authorization', 'Bearer ' + token);
        return headers;
    }
}
