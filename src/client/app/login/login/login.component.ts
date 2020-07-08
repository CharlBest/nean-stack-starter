import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { LoginViewModel } from '@shared/view-models/create-user/login.view-model';
import { LoginService } from '../../login/login.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;
  isProcessing = false;
  returnUrl = '/';
  showTwoFactorAuthentication = false;

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private dialogService: DialogService) {
  }

  ngOnInit(): void {
    if (this.authService.hasToken() && !this.route.snapshot.queryParams.tut) {
      this.router.navigate(['/']);
    }

    this.getQueryParams();
    this.formOnInit();
  }

  formOnInit(): void {
    this.formGroup = this.fb.group(FormGroupBuilder.login());
  }

  getQueryParams(): void {
    const returnUrl = this.route.snapshot.queryParams.returnUrl;
    if (returnUrl) {
      this.returnUrl = returnUrl;
    }
  }

  async onSubmit(): Promise<void> {
    this.isProcessing = true;

    const viewModel = new LoginViewModel();
    viewModel.emailOrUsername = this.formGroup.controls.emailOrUsername.value.trim();
    viewModel.password = this.formGroup.controls.password.value;
    viewModel.twoFactorAuthenticationCode = this.formGroup.controls.twoFactorAuthenticationCode.value;

    try {
      const response = await this.loginService.login(viewModel);
      if (response && !response.token && response.twoFactorAuthenticationEnabled) {
        this.dialogService.alert({
          title: 'Action needed',
          body: 'Please provide your two factor authentication code from your Authenticator/One Time Pin app'
        });
        this.showTwoFactorAuthentication = true;
        this.isProcessing = false;
      } else if (response && response.token) {
        // Login successful
        this.authService.setToken(response);

        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.dialogService.alert({
          title: 'Problem',
          body: 'Authentication failed'
        });
        this.isProcessing = false;
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.formGroup);
      this.isProcessing = false;
    }
  }
}
