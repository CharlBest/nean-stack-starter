import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { trimString, Validators } from '../../../../shared/validation/validators';
import { ForgotPasswordViewModel } from '../../../../shared/view-models/forgot-password/forgot-password.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { BreakpointService } from '../../shared/breakpoint.service';
import { FormService } from '../../shared/form.service';
import { ForgotPasswordService } from '../forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup;
  serverErrors;
  isProcessing = false;
  emailSent = false;
  tutorialTypeEnum = TutorialType;

  constructor(private fb: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private formService: FormService,
    public bpService: BreakpointService) {
  }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.form = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new ForgotPasswordViewModel();
    viewModel.email = trimString(this.form.get('email').value);

    this.forgotPasswordService.forgotPassword(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.emailSent = true;
      }, error => {
        this.serverErrors = this.formService.getServerErrors(error);
      });
  }
}
