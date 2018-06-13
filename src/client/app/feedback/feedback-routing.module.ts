import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeedbackComponent } from '../feedback/feedback/feedback.component';
import { HeaderType } from '../shared/header/header/header-type.enum';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FeedbackComponent, pathMatch: 'full', data: { title: 'Feedback', nav: HeaderType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class FeedbackRoutingModule { }
