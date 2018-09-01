import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatSnackBarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';

const materialModules = [
  MatSnackBarModule,
  MatButtonModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ...materialModules
  ],
  declarations: [
    CookieConsentComponent
  ],
  entryComponents: [
    CookieConsentComponent
  ]
})
export class CookieConsentModule { }
