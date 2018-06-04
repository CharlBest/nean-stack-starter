import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navigation } from '../shared/navigation/navigation/navigation.component';
import { CreateUserComponent } from './create-user/create-user.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CreateUserComponent, pathMatch: 'full', data: { title: 'Create account', nav: Navigation.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class CreateUserRoutingModule { }
