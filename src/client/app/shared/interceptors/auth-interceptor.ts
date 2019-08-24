import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DialogService } from '../dialog/dialog.service';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
        private localStorageService: LocalStorageService,
        private dialogService: DialogService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Stop request if token has expired
        if (this.authService.hasToken() && this.authService.hasStoredTokenExpired()) {
            this.dialogService.confirm('Your session has expired. Please log back in.', 'Sign In').then(() => {
                this.authService.removeTokenAndNavigateToLogin();
            });
            return NEVER;
        }

        // Get the auth header from the service.
        const authToken = this.localStorageService.storageData.token;
        // Clone the request to add the new header.
        const authRequest = authToken ? request.clone({ headers: request.headers.set('Authorization', `Bearer ${authToken}`) }) : request;
        // Pass on the cloned request instead of the original request.
        return next.handle(authRequest).pipe(
            tap((event: HttpEvent<any>) => {
                // if (event instanceof HttpResponse) do stuff with response if you want
            }, err => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401 && !this.authService.shouldPreventLogoutOnNextRequest) {
                        console.error('Authentication 401 Unauthorized', err);

                        // This will redirect to the login page
                        this.authService.removeTokenAndNavigateToLogin();
                    }
                    if (err.status === 500) {
                        // server down
                    }
                }
            })
        );
    }
}
