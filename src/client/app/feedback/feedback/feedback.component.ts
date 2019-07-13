import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormGroupBuilder } from '../../../../shared/validation/form-group-builder';
import { FeedbackViewModel } from '../../../../shared/view-models/feedback/feedback.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { FeedbackService } from '../feedback.service';

@Component({
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  formGroup: FormGroup;
  isProcessing = false;
  isDone = false;
  tutorialTypeEnum = TutorialType;

  constructor(private feedbackService: FeedbackService,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.feedback());
  }

  async onSubmit() {
    this.isProcessing = true;

    const viewModel = new FeedbackViewModel();
    viewModel.content = this.formGroup.controls.content.value;

    try {
      await this.feedbackService.sendFeedback(viewModel);
      this.isDone = true;
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.formGroup);
    } finally {
      this.isProcessing = false;
    }
  }
}
