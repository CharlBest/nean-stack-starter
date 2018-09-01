import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatListModule, MatRadioModule, MatTableModule } from '@angular/material';
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
