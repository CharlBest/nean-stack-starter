import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FeedbackViewModel } from '../../../../shared/view-models/feedback/feedback.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { BreakpointService } from '../../shared/breakpoint.service';
import { FormService } from '../../shared/form.service';
import { FeedbackService } from '../feedback.service';

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
    private formService: FormService,
    public bpService: BreakpointService) { }

  send(content: string) {
    this.isProcessing = true;

    const viewModel = new FeedbackViewModel();
    viewModel.content = content;

    this.feedbackService.sendFeedback(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.serverErrors = this.formService.getServerErrors(error);
      });
  }
}
