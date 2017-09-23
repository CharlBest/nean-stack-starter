import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navigation } from '../navigation/navigation/navigation.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ProfileComponent, data: { title: 'Profile', nav: Navigation.Primary } }
        ])
    ],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
