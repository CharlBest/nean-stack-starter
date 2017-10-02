import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdButtonModule, MdCardModule, MdRadioModule } from '@angular/material';
import { LegalService } from './legal.service';
import { LegalRoutingModule } from './legal-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { HelpComponent } from './help/help.component';

@NgModule({
  imports: [
    CommonModule,
    LegalRoutingModule,
    MdButtonModule,
    MdCardModule,
    MdRadioModule
  ],
  declarations: [
    HelpComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
  ],
  providers: [
    LegalService
  ]
})
export class LegalModule { }
