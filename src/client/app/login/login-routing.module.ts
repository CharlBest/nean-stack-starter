import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { LoginComponent } from './login/login.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: LoginComponent, pathMatch: 'full', data: { title: 'Login', nav: HeaderType.Primary } }
        ])
    ],
    exports: [RouterModule]
})
export class LoginRoutingModule { }
