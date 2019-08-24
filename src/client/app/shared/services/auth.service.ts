import { EventEmitter, Injectable, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserTokenModel } from '@shared/models/shared/user-token.model';
import { TokenViewModel } from '@shared/view-models/create-user/token.view-model';
import { LocalStorageService, StorageData } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements CanActivate {

    @Output() userLoggedInOrLoggedOut: EventEmitter<void> = new EventEmitter<void>();

    get loggedInUserId(): number | null | undefined {
        return this.localStorageService.userData.userId;
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

    constructor(private router: Router,
        private dialog: MatDialog,
        private localStorageService: LocalStorageService) { }

    init() {
        const accountKeys: Array<string> = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.localStorageService.storagePrefix) && !key.endsWith('__')) {
                accountKeys.push(key);
            }
        }

        let userData: StorageData | null = null;
        for (const key of accountKeys) {
            const data = this.getUserData(key);
            if (data && data.token && !this.hasTokenExpired(data.token)) {
                userData = data;
            }
        }

        if (userData && userData.token) {
            // load user data
            const { id, expireDate } = this.getDataFromJWT(userData.token);

            this.localStorageService.updateUserData(id, expireDate);

            this.localStorageService.setUserStorageData(userData);
        } else {
            // load anonymous data
            const anonymousData = localStorage.getItem(`${this.localStorageService.storagePrefix}_`);
            if (anonymousData) {
                this.localStorageService.setUserStorageData(this.parseJSON(anonymousData) as StorageData);
            } else { // Save initial default values
                const stringData = JSON.stringify(this.localStorageService.storageData);
                localStorage.setItem(`${this.localStorageService.storagePrefix}_`, stringData);

                // Create data in local storage if not exist yet
                this.localStorageService.setUserStorageData();
            }
        }
    }

    getUserData(accountKey: string): StorageData | null {
        const userIdStartIndex = this.localStorageService.storagePrefix.length;
        const userIdSuffix = accountKey.substring(userIdStartIndex);
        const data = localStorage.getItem(`${this.localStorageService.storagePrefix}${userIdSuffix}`);
        if (data) {
            const jsonData = this.parseJSON(data) as StorageData;
            if (jsonData) {
                return jsonData; // user data
            } else {
                return null; // anonymous data
            }
        } else {
            return null; // anonymous data
        }
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.hasToken() || this.router.navigate(['login'], { queryParams: { returnUrl: state.url }, queryParamsHandling: 'merge' });
    }

    setToken(model: TokenViewModel) {
        // Get token data
        const { id, expireDate } = this.getDataFromJWT(model.token);

        // Save token data in memory (needs to be saved before stored into local storage for correct prefix generation)
        this.localStorageService.updateUserData(id, expireDate);

        // Save local storage in memory for user
        this.localStorageService.updateStoredData();

        // Store token in local storage as well as email and username to select multiple accounts
        this.localStorageService.setUserStorageData({
            email: model.email,
            username: model.username,
            token: model.token
        });

        this.userLoggedInOrLoggedOut.emit();
    }

    removeToken() {
        this.localStorageService.setUserStorageData({ token: null });

        this.localStorageService.updateUserData(null, null);

        this.localStorageService.updateStoredData();

        this.userLoggedInOrLoggedOut.emit();
    }

    removeTokenAndNavigateToLogin() {
        this.removeToken();
        this.router.navigate(['login'], { queryParams: { returnUrl: this.router.url }, queryParamsHandling: 'merge' });
        this.dialog.closeAll();
    }

    hasToken(): boolean {
        return !!this.localStorageService.storageData.token;
    }

    preventLogoutOnNextRequest() {
        this.preventLogoutOnNextRequestFlag = true;
    }

    hasTokenExpired(token?: string | null) {
        const { id, expireDate } = this.getDataFromJWT(token);
        if (!id || !expireDate) {
            return true;
        }

        if (Math.floor(Date.now() / 1000) >= expireDate) {
            return true;
        } else {
            return false;
        }
    }

    hasStoredTokenExpired() {
        return this.hasTokenExpired(this.localStorageService.storageData.token);
    }

    private getDataFromJWT(token: string | null | undefined): { id: number | null, expireDate: number | null } {
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
        return this.parseJSON(window.atob(base64));
    }

    private parseJSON(jsonString: string): any {
        try {
            return JSON.parse(jsonString);
        } catch {
            console.error('Error parsing JSON string');
            return null;
        }
    }
}
