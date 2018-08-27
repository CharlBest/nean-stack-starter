import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { UserComponent } from './user/user.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: ':id', component: UserComponent, pathMatch: 'full', data: { title: 'User', nav: NavigationType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class UserRoutingModule { }
