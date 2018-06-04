import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeedbackComponent } from '../feedback/feedback/feedback.component';
import { Navigation } from '../shared/navigation/navigation/navigation.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FeedbackComponent, pathMatch: 'full', data: { title: 'Feedback', nav: Navigation.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class FeedbackRoutingModule { }
