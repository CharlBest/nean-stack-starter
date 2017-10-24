import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackRoutingModule } from '../feedback/feedback-routing.module';
import { FeedbackService } from './feedback.service';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TutorialModule
  ],
  declarations: [
    FeedbackComponent
  ],
  providers: [FeedbackService]
})
export class FeedbackModule { }
