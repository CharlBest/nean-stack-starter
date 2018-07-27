import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ProfileComponent, pathMatch: 'full', data: { title: 'Profile', nav: HeaderType.Primary } },
            { path: 'payment-history', component: PaymentHistoryComponent, pathMatch: 'full', data: { title: 'Payment History', nav: HeaderType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
