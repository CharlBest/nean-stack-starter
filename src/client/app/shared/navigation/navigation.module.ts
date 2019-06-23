import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { CookieConsentModule } from '../cookie-consent/cookie-consent.module';
import { IconsModule } from '../icons/icons.module';
import { NavigationComponent } from './navigation/navigation.component';

const materialModules = [
  MatButtonModule,
  MatSnackBarModule,
  MatCardModule,
  MatToolbarModule,
  MatTooltipModule,
  MatBadgeModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CookieConsentModule,
    IconsModule,
    ...materialModules
  ],
  exports: [
    NavigationComponent
  ],
  declarations: [
    NavigationComponent
  ]
})
export class NavigationModule { }
