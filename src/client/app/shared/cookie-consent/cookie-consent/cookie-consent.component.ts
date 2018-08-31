import { Component } from '@angular/core';
import { CookieConsentService } from '../cookie-consent.service';

@Component({
  selector: 'my-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent {
  constructor(public cookieConsentService: CookieConsentService) { }
}