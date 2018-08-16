import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { UserComponent } from './user/user.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: UserComponent, pathMatch: 'full', data: { title: 'User', nav: HeaderType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class UserRoutingModule { }
