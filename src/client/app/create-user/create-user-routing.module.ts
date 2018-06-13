import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { CreateUserComponent } from './create-user/create-user.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CreateUserComponent, pathMatch: 'full', data: { title: 'Create account', nav: HeaderType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class CreateUserRoutingModule { }
