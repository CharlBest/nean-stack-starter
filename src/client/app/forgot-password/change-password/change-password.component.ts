import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormGroupBuilder } from '../../../../shared/validation/form-group-builder';
import { ChangeForgottenPasswordViewModel } from '../../../../shared/view-models/forgot-password/change-forgotten-password.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { PasswordStrengthService } from '../../shared/password-strength/password-strength.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { ForgotPasswordService } from '../forgot-password.service';

@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  formGroup: FormGroup;
  code: string | null;
  email: string | null;
  isProcessing = false;

  constructor(private route: ActivatedRoute,
    private forgotPasswordService: ForgotPasswordService,
    private fb: FormBuilder,
    private router: Router,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private passwordStrengthService: PasswordStrengthService) { }

  ngOnInit() {
    this.getParams();
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.changeForgottenPassword());
  }

  getParams() {
    this.route.queryParamMap.subscribe(params => {
      if (params.has('code')) {
        this.code = params.get('code');
      }
      if (params.has('email')) {
        this.email = params.get('email');
      }
    });
  }

  onSubmit() {
    this.passwordStrengthService.init(this.formGroup.controls.password.value).subscribe(data => {
      if (data) {
        this.changeForgottenPassword();
      }
    });
  }

  changeForgottenPassword() {
    if (this.email && this.code) {
      this.isProcessing = true;

      const viewModel = new ChangeForgottenPasswordViewModel();
      viewModel.email = this.email.trim();
      viewModel.code = this.code;
      viewModel.password = this.formGroup.controls.password.value;

      this.forgotPasswordService.changeForgottenPassword(viewModel)
        .pipe(finalize(() => this.isProcessing = false))
        .subscribe(() => {
          this.router.navigate(['/login']);
        }, error => {
          this.formErrorsService.updateFormValidity(error, this.formGroup);
        });
    } else {
      console.error('Email or Code is null');
    }
  }
}
