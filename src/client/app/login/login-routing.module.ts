import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login/login.component';
import { Navigation } from '../shared/navigation/navigation/navigation.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: LoginComponent, pathMatch: 'full', data: { title: 'Login', nav: Navigation.Primary } }
        ])
    ],
    exports: [RouterModule]
})
export class LoginRoutingModule { }
