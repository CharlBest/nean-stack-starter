import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { FeedbackViewModel } from '@shared/view-models/feedback/feedback.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { AuthService } from '../../shared/services/auth.service';
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

  constructor(private feedbackService: FeedbackService,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private fb: FormBuilder,
    private analyticsService: AnalyticsService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.formOnInit();
  }

  formOnInit(): void {
    this.formGroup = this.fb.group(FormGroupBuilder.feedback());
  }

  async onSubmit(): Promise<void> {
    this.isProcessing = true;

    const viewModel = new FeedbackViewModel();
    viewModel.content = this.formGroup.controls.content.value;

    try {
      await this.feedbackService.sendFeedback(viewModel);
      this.isDone = true;

      // Report to analytics
      this.analyticsService.reportFeedback(viewModel.content, this.authService.loggedInUserId);
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.formGroup);
    } finally {
      this.isProcessing = false;
    }
  }
}
