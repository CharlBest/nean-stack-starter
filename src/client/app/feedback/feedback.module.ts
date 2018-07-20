import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { FeedbackRoutingModule } from './feedback-routing.module';
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
    ReactiveFormsModule,
    TutorialModule,
    FormErrorsModule,
    ...materialModules
  ],
  declarations: [
    FeedbackComponent
  ]
})
export class FeedbackModule { }
