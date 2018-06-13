import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login/login.component';
import { HeaderType } from '../shared/header/header/header-type.enum';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: LoginComponent, pathMatch: 'full', data: { title: 'Login', nav: HeaderType.Primary } }
        ])
    ],
    exports: [RouterModule]
})
export class LoginRoutingModule { }
