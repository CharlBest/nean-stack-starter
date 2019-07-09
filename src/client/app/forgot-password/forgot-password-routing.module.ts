import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: ForgotPasswordComponent, pathMatch: 'full',
                data: { title: 'Request forgotten password', nav: NavigationType.BACK }
            },
            {
                path: 'reset', component: ChangePasswordComponent, pathMatch: 'full',
                data: { title: 'Change password', nav: NavigationType.BACK }
            }
        ])
    ],
    exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }
