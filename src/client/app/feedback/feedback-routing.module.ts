import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { FeedbackComponent } from './feedback/feedback.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FeedbackComponent, pathMatch: 'full', data: { title: 'Feedback', nav: NavigationType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class FeedbackRoutingModule { }
