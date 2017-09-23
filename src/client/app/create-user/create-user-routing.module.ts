import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { Navigation } from '../navigation/navigation/navigation.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CreateUserComponent, data: { title: 'Create profile', nav: Navigation.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class CreateUserRoutingModule { }
