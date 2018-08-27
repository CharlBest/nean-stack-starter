import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation/navigation-type.enum';
import { CreateUserComponent } from './create-user/create-user.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CreateUserComponent, pathMatch: 'full', data: { title: 'Create account', nav: NavigationType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class CreateUserRoutingModule { }
