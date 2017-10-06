import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback/feedback.component';
import { MdButtonModule, MdCardModule, MdInputModule, MdProgressSpinnerModule } from '@angular/material';
import { FeedbackRoutingModule } from '../feedback/feedback-routing.module';
import { FeedbackService } from './feedback.service';
import { TutorialModule } from '../shared/tutorial/tutorial.module';

@NgModule({
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    MdProgressSpinnerModule,
    TutorialModule
  ],
  declarations: [
    FeedbackComponent
  ],
  providers: [FeedbackService]
})
export class FeedbackModule { }
