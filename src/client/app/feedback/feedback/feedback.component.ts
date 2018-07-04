import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/new-validators';
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
export class FeedbackComponent implements OnInit {

  formGroup: FormGroup;
  isProcessing = false;
  tutorialTypeEnum = TutorialType;

  constructor(private feedbackService: FeedbackService,
    private router: Router,
    private formService: FormService,
    public bpService: BreakpointService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.feedback());
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new FeedbackViewModel();
    viewModel.content = this.formGroup.get('content').value;

    this.feedbackService.sendFeedback(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.formService.applyServerErrorValidationOnForm(error, this.formGroup);
      });
  }
}
