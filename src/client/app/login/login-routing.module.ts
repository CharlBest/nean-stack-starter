import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login/login.component';
import { Navigation } from '../navigation/navigation/navigation.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: LoginComponent, data: { title: 'Login', nav: Navigation.Primary } }
        ])
    ],
    exports: [RouterModule]
})
export class LoginRoutingModule { }
