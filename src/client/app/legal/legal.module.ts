import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatRadioModule } from '@angular/material';
import { HelpComponent } from './help/help.component';
import { LegalRoutingModule } from './legal-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatRadioModule
];

@NgModule({
  imports: [
    CommonModule,
    LegalRoutingModule,
    ...materialModules
  ],
  declarations: [
    HelpComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
  ],
  providers: []
})
export class LegalModule { }
