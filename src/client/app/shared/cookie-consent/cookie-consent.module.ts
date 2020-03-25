import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
  ]
})
export class CookieConsentModule { }
