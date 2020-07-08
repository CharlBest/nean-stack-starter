import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '../translate/translate.service';

@Injectable({
    providedIn: 'root'
})
export class LanguageInterceptor implements HttpInterceptor {

    constructor(private translateService: TranslateService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // Clone the request to add the new header.
        const languageRequest = request.clone({
            headers: request.headers.set('Accept-Language', `${this.translateService.activeLanguage}`)
        });
        // Pass on the cloned request instead of the original request.
        return next.handle(languageRequest);
    }
}
