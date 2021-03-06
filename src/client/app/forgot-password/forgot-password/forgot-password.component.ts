import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { ForgotPasswordViewModel } from '@shared/view-models/forgot-password/forgot-password.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { ForgotPasswordService } from '../forgot-password.service';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  formGroup: FormGroup;
  isProcessing = false;
  isDone = false;

  constructor(private fb: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService) {
  }

  ngOnInit(): void {
    this.formOnInit();
  }

  formOnInit(): void {
    this.formGroup = this.fb.group(FormGroupBuilder.forgotPassword());
  }

  async onSubmit(): Promise<void> {
    this.isProcessing = true;

    const viewModel = new ForgotPasswordViewModel();
    viewModel.email = this.formGroup.controls.email.value.trim();

    try {
      await this.forgotPasswordService.forgotPassword(viewModel);
      this.isDone = true;
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.formGroup);
    } finally {
      this.isProcessing = false;
    }
  }
}
