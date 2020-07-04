import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { Validators } from '@shared/validation/validators';
import { CreateUserViewModel } from '@shared/view-models/create-user/create-user.view-model';
import { LoginViewModel } from '@shared/view-models/create-user/login.view-model';
import { TutorialType } from '@shared/view-models/tutorial/tutorial-type.enum';
import { LoginService } from '../../login/login.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { PasswordStrengthService } from '../../shared/password-strength/password-strength.service';
import { AuthService } from '../../shared/services/auth.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { CreateUserService } from '../create-user.service';

@Component({
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  formGroup: FormGroup;
  isProcessing = false;
  returnUrl: string | null = null;

  constructor(private fb: FormBuilder,
    private createUserService: CreateUserService,
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private dialogService: DialogService,
    private passwordStrengthService: PasswordStrengthService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.formOnInit();
    this.getParams();
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.createUser());

    // Show individually which characters are required (only for UI)
    this.formGroup.controls.password.setValidators(this.formGroup.controls.password.validator ?
      [this.formGroup.controls.password.validator, Validators.passwordCharacters] : Validators.passwordCharacters);
  }

  getParams() {
    const returnUrl = this.route.snapshot.queryParams.returnUrl;
    if (returnUrl) {
      this.returnUrl = returnUrl;
    }
  }

  async onSubmit() {
    const passedCommonlyUsedTest = await this.passwordStrengthService.passCommonlyUsedTest(this.formGroup.controls.password.value);
    if (passedCommonlyUsedTest) {
      this.createUser();
    }
  }

  async createUser() {
    this.isProcessing = true;

    const viewModel = new CreateUserViewModel();
    viewModel.email = this.formGroup.controls.email.value.trim();
    viewModel.username = this.formGroup.controls.username.value.trim();
    viewModel.password = this.formGroup.controls.password.value;

    try {
      await this.createUserService.createUser(viewModel);
      this.automaticLogin();
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.formGroup);
      this.isProcessing = false;
    }
  }

  async automaticLogin() {
    const model = new LoginViewModel();
    model.emailOrUsername = this.formGroup.controls.email.value;
    model.password = this.formGroup.controls.password.value;

    try {
      const response = await this.loginService.login(model);
      if (response && response.token) {
        this.authService.setToken(response);

        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.router.navigate(['/profile'], { queryParams: { tut: TutorialType.AVATAR_UPLOAD }, queryParamsHandling: 'merge' });
        }
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
