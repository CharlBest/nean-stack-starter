import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { FeedbackViewModel } from '../../../../shared/view-models/feedback/feedback.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { FeedbackService } from '../feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  formGroup: FormGroup;
  isProcessing = false;
  isDone = false;
  tutorialTypeEnum = TutorialType;

  constructor(private feedbackService: FeedbackService,
    private router: Router,
    public formErrorsService: FormErrorsService,
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
    viewModel.content = this.formGroup.controls['content'].value;

    this.feedbackService.sendFeedback(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.isDone = true;
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.formGroup);
      });
  }
}
