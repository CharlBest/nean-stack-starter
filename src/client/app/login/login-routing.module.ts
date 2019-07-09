import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { LoginComponent } from './login/login.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: LoginComponent, pathMatch: 'full',
                data: { title: 'Login', nav: NavigationType.BACK }
            }
        ])
    ],
    exports: [RouterModule]
})
export class LoginRoutingModule { }
