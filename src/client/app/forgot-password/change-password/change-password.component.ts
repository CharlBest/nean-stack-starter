import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { trimString, Validators } from '../../../../shared/validation/validators';
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

  form: FormGroup;
  serverErrors;
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
    this.form = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new ChangeForgottenPasswordViewModel;
    viewModel.email = trimString(this.email);
    viewModel.code = this.code;
    viewModel.password = this.form.get('password').value;

    this.forgotPasswordService.changeForgottenPassword(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        const link = ['/login'];
        this.router.navigate(link);
      }, error => {
        this.serverErrors = this.formService.getServerErrors(error);
      });
  }
}
