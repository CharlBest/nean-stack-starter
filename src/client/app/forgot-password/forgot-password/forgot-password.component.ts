import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { ForgotPasswordViewModel } from '../../../../shared/view-models/forgot-password/forgot-password.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { ForgotPasswordService } from '../forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  formGroup: FormGroup;
  isProcessing = false;
  isDone = false;
  tutorialTypeEnum = TutorialType;

  constructor(private fb: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService) {
  }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.forgotPassword());
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new ForgotPasswordViewModel();
    viewModel.email = this.formGroup.controls['email'].value.trim();

    this.forgotPasswordService.forgotPassword(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.isDone = true;
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.formGroup);
      });
  }
}
