import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { DevComponent } from './dev/dev.component';
import { HelpComponent } from './help/help.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { UserDataComponent } from './user-data/user-data.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'terms-and-conditions', component: TermsAndConditionsComponent, pathMatch: 'full', data: { title: 'Terms and Conditions', nav: NavigationType.Back } },
            { path: 'privacy-policy', component: PrivacyPolicyComponent, pathMatch: 'full', data: { title: 'Privacy Policy', nav: NavigationType.Back } },
            { path: 'help', component: HelpComponent, pathMatch: 'full', data: { title: 'Help', nav: NavigationType.Back } },
            { path: 'dev', component: DevComponent, pathMatch: 'full', data: { title: 'Developer', nav: NavigationType.Back } },
            { path: 'user-data', component: UserDataComponent, pathMatch: 'full', data: { title: 'Your Data', nav: NavigationType.Back } },
            { path: 'cookie-policy', component: CookiePolicyComponent, pathMatch: 'full', data: { title: 'Cookie Policy', nav: NavigationType.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class BusinessRoutingModule { }
