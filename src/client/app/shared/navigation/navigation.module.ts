import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CookieConsentModule } from '../cookie-consent/cookie-consent.module';
import { IconsModule } from '../icons/icons.module';
import { InstallBannerComponent } from './install-banner/install-banner.component';
import { NavRightPlaceholderDirective } from './nav-right-placeholder.directive';
import { NavigationComponent } from './navigation/navigation.component';

const materialModules = [
  MatButtonModule,
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
    NavigationComponent,
    NavRightPlaceholderDirective
  ],
  declarations: [
    NavigationComponent,
    InstallBannerComponent,
    NavRightPlaceholderDirective
  ]
})
export class NavigationModule { }
