import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { HelpComponent } from './help/help.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'termsandconditions', component: TermsAndConditionsComponent, pathMatch: 'full', data: { title: 'Terms and Conditions', nav: HeaderType.Back } },
            { path: 'privacypolicy', component: PrivacyPolicyComponent, pathMatch: 'full', data: { title: 'Privacy Policy', nav: HeaderType.Back } },
            { path: 'help', component: HelpComponent, pathMatch: 'full', data: { title: 'Help', nav: HeaderType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class LegalRoutingModule { }
