import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation/navigation-type.enum';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ProfileComponent, pathMatch: 'full', data: { title: 'Profile', nav: NavigationType.Primary } },
            { path: 'payment-history', component: PaymentHistoryComponent, pathMatch: 'full', data: { title: 'Payment History', nav: NavigationType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
