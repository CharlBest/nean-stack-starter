import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../services/storage.service';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {

  constructor(private snackBar: MatSnackBar,
    private localStorageService: LocalStorageService) { }

  openCookieConsentSnackBar(): void {
    if (!this.localStorageService.storageData.consent) {
      this.snackBar.openFromComponent(CookieConsentComponent, {
        duration: undefined
      });
    }
  }
}
