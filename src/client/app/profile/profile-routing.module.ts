import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { CreateCardComponent } from './create-card/create-card.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ProfileComponent, pathMatch: 'full', data: { title: 'Profile', nav: NavigationType.Back } },
            { path: 'payment-history', component: PaymentHistoryComponent, pathMatch: 'full', data: { title: 'Payment History', nav: NavigationType.Back } },
            { path: 'create-card', component: CreateCardComponent, pathMatch: 'full', data: { title: 'Create Card', nav: NavigationType.Back } },
            { path: 'delete', component: DeleteUserComponent, pathMatch: 'full', data: { title: 'Delete Account', nav: NavigationType.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
