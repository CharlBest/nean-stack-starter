import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormService } from '../../shared/form.service';
import { ForgotPasswordService } from '../forgot-password.service';
import { ChangeForgottenPasswordViewModel } from '../../../../server/view-models/forgot-password/change-forgotten-password.view-model';
import { Validators } from '../../../../server/validation/validators';

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
    private formService: FormService) { }

  ngOnInit() {
    this.buildForm();

    this.route.queryParamMap.subscribe(params => {
      if (params.has('code')) {
        this.code = params.get('code');
      }
      if (params.has('email')) {
        this.email = params.get('email');
      }
    });
  }

  buildForm() {
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
    viewModel.email = this.email;
    viewModel.code = this.code;
    viewModel.password = this.form.get('password').value;

    this.forgotPasswordService.changeForgottenPassword(viewModel).subscribe(
      data => {
        const link = ['/login'];
        this.router.navigate(link);
      }, error => {
        this.isProcessing = false;
        this.serverErrors = this.formService.getServerErrors(error);
      });
  }
}
