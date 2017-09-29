import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChangePasswordComponent } from '../forgot-password/change-password/change-password.component';
import { Navigation } from '../shared/navigation/navigation/navigation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ForgotPasswordComponent, pathMatch: 'full', data: { title: 'Request forgotten password', nav: Navigation.Back } },
            { path: 'reset', component: ChangePasswordComponent, pathMatch: 'full', data: { title: 'Change password', nav: Navigation.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }
