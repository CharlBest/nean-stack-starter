import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { GitHubModule } from '../shared/github/github.module';
import { PWAHelperModule } from '../shared/pwa-helper/pwa-helper.module';
import { BusinessRoutingModule } from './business-routing.module';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { DevComponent } from './dev/dev.component';
import { HelpComponent } from './help/help.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { UserDataComponent } from './user-data/user-data.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatRadioModule,
  MatTableModule,
  MatListModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [
    CommonModule,
    BusinessRoutingModule,
    PWAHelperModule,
    GitHubModule,
    ...materialModules
  ],
  declarations: [
    HelpComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    DevComponent,
    UserDataComponent,
    CookiePolicyComponent,
  ]
})
export class BusinessModule { }
