import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            tap((event: HttpEvent<unknown>) => {
                // if (event instanceof HttpResponse) do stuff with response if you want
            }, err => {
                if (err instanceof Error) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.log('An error occurred:', err.message);
                }

                if (err instanceof HttpErrorResponse) {
                    // Neo4j offline
                    if (err.status === 400
                        && err.error
                        && err.error.error
                        && err.error.error.error
                        && err.error.error.error.name === 'Neo4jError'
                        && err.error.error.error.code === 'ServiceUnavailable') {
                        console.error('Neo4j is offline', err);
                    }

                    console.error(err);
                }
            })
        );
    }
}
