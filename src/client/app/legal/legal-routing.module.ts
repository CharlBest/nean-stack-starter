import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navigation } from '../shared/navigation/navigation/navigation.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { HelpComponent } from './help/help.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'termsandconditions', component: TermsAndConditionsComponent, pathMatch: 'full', data: { title: 'Terms and Conditions', nav: Navigation.Back } },
            { path: 'privacypolicy', component: PrivacyPolicyComponent, pathMatch: 'full', data: { title: 'Privacy Policy', nav: Navigation.Back } },
            { path: 'help', component: HelpComponent, pathMatch: 'full', data: { title: 'Help', nav: Navigation.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class LegalRoutingModule { }
