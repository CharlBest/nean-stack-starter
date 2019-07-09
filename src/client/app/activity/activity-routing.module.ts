import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { ActivityComponent } from './activity/activity.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: ActivityComponent, pathMatch: 'full',
                data: { title: 'Activity', nav: NavigationType.PRIMARY }
            },
        ])
    ],
    exports: [RouterModule]
})
export class ActivityRoutingModule { }
