import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { ActivityComponent } from './activity/activity.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ActivityComponent, pathMatch: 'full', data: { title: 'Activity', nav: HeaderType.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class ActivityRoutingModule { }
