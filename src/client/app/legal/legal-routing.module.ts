import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { DevComponent } from './dev/dev.component';
import { HelpComponent } from './help/help.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'termsandconditions', component: TermsAndConditionsComponent, pathMatch: 'full', data: { title: 'Terms and Conditions', nav: NavigationType.Back } },
            { path: 'privacypolicy', component: PrivacyPolicyComponent, pathMatch: 'full', data: { title: 'Privacy Policy', nav: NavigationType.Back } },
            { path: 'help', component: HelpComponent, pathMatch: 'full', data: { title: 'Help', nav: NavigationType.Back } },
            { path: 'dev', component: DevComponent, pathMatch: 'full', data: { title: 'Developer', nav: NavigationType.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class LegalRoutingModule { }
