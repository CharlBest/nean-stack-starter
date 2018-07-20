import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ForgotPasswordComponent, pathMatch: 'full', data: { title: 'Request forgotten password', nav: HeaderType.Back } },
            { path: 'reset', component: ChangePasswordComponent, pathMatch: 'full', data: { title: 'Change password', nav: HeaderType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }
