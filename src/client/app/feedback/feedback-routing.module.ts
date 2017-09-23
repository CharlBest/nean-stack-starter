import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login/login.component';
import { Navigation } from '../navigation/navigation/navigation.component';
import { FeedbackComponent } from '../feedback/feedback/feedback.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FeedbackComponent, data: { title: 'Feedback', nav: Navigation.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class FeedbackRoutingModule { }
