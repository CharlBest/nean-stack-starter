import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TutorialService } from '../tutorial/tutorial.service';
import { CookieConsentService } from './cookie-consent.service';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentSnackbarService {

  constructor(private snackBar: MatSnackBar,
    private cookieConsentService: CookieConsentService,
    private tutorialService: TutorialService) { }

  openCookieConsentSnackBar() {
    if (!this.cookieConsentService.hasAcceptedCookieConsent()) {
      setTimeout(() => this.cookieConsentService.snackBarRef = this.snackBar.openFromComponent(CookieConsentComponent, {
        duration: undefined
      }));
    } else {
      this.tutorialService.checkHasVisited();
    }
  }
}
