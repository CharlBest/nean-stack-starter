import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ProfileComponent, pathMatch: 'full', data: { title: 'Profile', nav: HeaderType.Primary } }
        ])
    ],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
