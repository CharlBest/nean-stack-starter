import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/new-validators';
import { trimString } from '../../../../shared/validation/validators';
import { ChangeForgottenPasswordViewModel } from '../../../../shared/view-models/forgot-password/change-forgotten-password.view-model';
import { BreakpointService } from '../../shared/breakpoint.service';
import { FormService } from '../../shared/form.service';
import { ForgotPasswordService } from '../forgot-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  formGroup: FormGroup;
  code: string;
  email: string;
  isProcessing = false;

  constructor(private route: ActivatedRoute,
    private forgotPasswordService: ForgotPasswordService,
    private fb: FormBuilder,
    private router: Router,
    private formService: FormService,
    public bpService: BreakpointService) { }

  ngOnInit() {
    this.formOnInit();

    this.route.queryParamMap.subscribe(params => {
      if (params.has('code')) {
        this.code = params.get('code');
      }
      if (params.has('email')) {
        this.email = params.get('email');
      }
    });
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.changePassword());
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new ChangeForgottenPasswordViewModel;
    viewModel.email = trimString(this.email);
    viewModel.code = this.code;
    viewModel.password = this.formGroup.get('password').value;

    this.forgotPasswordService.changeForgottenPassword(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        const link = ['/login'];
        this.router.navigate(link);
      }, error => {
        this.formService.applyServerErrorValidationOnForm(error, this.formGroup);
      });
  }
}
