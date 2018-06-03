import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get the auth header from the service.
        const authToken = this.authService.getLocalToken() || '';
        // Clone the request to add the new header.
        const authReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${authToken}`) });
        // Pass on the cloned request instead of the original request.
        return next.handle(authReq);
    }
}
