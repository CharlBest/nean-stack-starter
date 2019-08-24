import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserTokenModel } from '@shared/models/shared/user-token.model';
import { TranslateService } from '../translate/translate.service';
import { LocalStorageService, StorageKey } from './storage.service';
import { ThemeService } from './theme.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements CanActivate {

    get loggedInUserId(): number | null | undefined {
        return this.userService.storedLoggedInUserId;
    }

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
        private dialog: MatDialog,
        private localStorageService: LocalStorageService,
        private userService: UserService,
        private themeService: ThemeService,
        private translateService: TranslateService) { }

    init() {
        const token = this.getLocalToken();
        const { id, expireDate } = this.getDataFromJWT(token);

        this.userService.storedLoggedInUserId = id;
        this.tokenExpireDateInSeconds = expireDate;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.hasToken() || this.router.navigate(['login'], { queryParams: { returnUrl: state.url }, queryParamsHandling: 'merge' });
    }

    setToken(token: string) {
        // Get token data
        const { id, expireDate } = this.getDataFromJWT(token);

        // Save token data in memory (needs to be saved before stored into local storage for correct prefix generation)
        this.userService.storedLoggedInUserId = id;
        this.tokenExpireDateInSeconds = expireDate;

        // Store token in local storage
        this.localStorageService.setItem(StorageKey.TOKEN, token);

        // Copy local setting to account if not exist
        this.syncAnnonymousDataWithAccount();
    }

    removeToken() {
        this.localStorageService.removeItem(StorageKey.TOKEN);
        this.userService.storedLoggedInUserId = null;
        this.tokenExpireDateInSeconds = null;

        this.themeService.refresh();
        this.translateService.refresh();
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
        return this.localStorageService.getItem(StorageKey.TOKEN);
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

    private getDataFromJWT(token: string | null): { id: number | null, expireDate: number | null } {
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

    // TODO this method feels error prone with lots of permutation that can go wrong
    // also take into account that there are refreshes happening
    // Purpose of this is to copy all local settings to a user's settings when they
    // don't have them
    private syncAnnonymousDataWithAccount() {
        if (!this.userService.storedLoggedInUserId) {
            return;
        }

        // Onboarding
        if (!this.localStorageService.getItem(StorageKey.HAS_USER_VISITED)) {
            const value = localStorage.getItem(this.localStorageService.concatKeyPrefix(StorageKey.HAS_USER_VISITED, null));
            if (value) {
                this.localStorageService.setItem(StorageKey.HAS_USER_VISITED, value);
            }
        }

        // Cookie Consent
        if (!this.localStorageService.getItem(StorageKey.COOKIE_CONSENT)) {
            const value = localStorage.getItem(this.localStorageService.concatKeyPrefix(StorageKey.COOKIE_CONSENT, null));
            if (value) {
                this.localStorageService.setItem(StorageKey.COOKIE_CONSENT, value);
            }
        }

        // Theme
        if (!this.localStorageService.getItem(StorageKey.IS_DARK_THEME)) {
            const value = localStorage.getItem(this.localStorageService.concatKeyPrefix(StorageKey.IS_DARK_THEME, null));
            if (value) {
                this.localStorageService.setItem(StorageKey.IS_DARK_THEME, value);
            }
        }
        this.themeService.refresh();

        // Language
        if (!this.localStorageService.getItem(StorageKey.LANGUAGE)) {
            const value = localStorage.getItem(this.localStorageService.concatKeyPrefix(StorageKey.LANGUAGE, null));
            if (value) {
                this.localStorageService.setItem(StorageKey.LANGUAGE, value);
            }
        }
        this.translateService.refresh();
    }
}
