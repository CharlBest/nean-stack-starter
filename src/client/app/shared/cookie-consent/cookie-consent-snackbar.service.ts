import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieConsentService } from './cookie-consent.service';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentSnackbarService {

  constructor(private snackBar: MatSnackBar,
    private cookieConsentService: CookieConsentService) { }

  openCookieConsentSnackBar() {
    if (!this.cookieConsentService.hasAcceptedCookieConsent()) {
      window.setTimeout(() => this.cookieConsentService.snackBarRef = this.snackBar.openFromComponent(CookieConsentComponent, {
        duration: undefined
      }));
    }
  }
}
