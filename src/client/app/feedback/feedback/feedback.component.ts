import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { FeedbackService } from '../feedback.service';
import { FeedbackViewModel } from '../../../../shared/view-models/feedback/feedback.view-model';
import { FormService } from '../../shared/form.service';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {

  serverErrors;
  isProcessing = false;
  tutorialTypeEnum = TutorialType;

  constructor(private feedbackService: FeedbackService,
    private router: Router,
    private formService: FormService) { }

  send(content: string) {
    this.isProcessing = true;

    const viewModel = new FeedbackViewModel();
    viewModel.content = content;

    this.feedbackService.sendFeedback(viewModel).subscribe(data => {
      this.router.navigate(['/']);
    }, error => {
      this.isProcessing = false;
      this.serverErrors = this.formService.getServerErrors(error);
    });
  }
}
