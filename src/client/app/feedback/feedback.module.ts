import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { FeedbackRoutingModule } from '../feedback/feedback-routing.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { FeedbackComponent } from './feedback/feedback.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    TutorialModule,
    ...materialModules
  ],
  declarations: [
    FeedbackComponent
  ],
  providers: []
})
export class FeedbackModule { }
