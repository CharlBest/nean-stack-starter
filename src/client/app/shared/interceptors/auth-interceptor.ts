import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get the auth header from the service.
        const authToken = this.authService.getLocalToken() || '';
        // Clone the request to add the new header.
        const authRequest = request.clone({ headers: request.headers.set('Authorization', `Bearer ${authToken}`) });
        // Pass on the cloned request instead of the original request.
        return next.handle(authRequest).pipe(
            tap((event: HttpEvent<any>) => {
                // if (event instanceof HttpResponse) do stuff with response if you want
            }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        console.error('Authentication 401 Unauthorized', err);

                        // This will redirect to the login page
                        this.authService.removeToken();
                    }
                }
            })
        );
    }
}
