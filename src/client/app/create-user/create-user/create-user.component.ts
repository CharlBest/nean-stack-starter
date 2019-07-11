import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormGroupBuilder } from '../../../../shared/validation/form-group-builder';
import { CreateUserViewModel } from '../../../../shared/view-models/create-user/create-user.view-model';
import { LoginViewModel } from '../../../../shared/view-models/create-user/login.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
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

  constructor(private fb: FormBuilder,
    private createUserService: CreateUserService,
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private dialogService: DialogService,
    private passwordStrengthService: PasswordStrengthService) { }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.createUser());
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
      this.setUserToken();
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.formGroup);
      this.isProcessing = false;
    }
  }

  async setUserToken() {
    this.isProcessing = true;

    const model = new LoginViewModel();
    model.emailOrUsername = this.formGroup.controls.email.value;
    model.password = this.formGroup.controls.password.value;

    try {
      const response = await this.loginService.login(model);
      if (response && response.token) {
        this.authService.setToken(response.token);
        this.router.navigate(['/profile'], { queryParams: { tut: TutorialType.AVATAR_UPLOAD }, queryParamsHandling: 'merge' });
      } else {
        this.dialogService.alert('Authentication failed');
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.formGroup);
    } finally {
      this.isProcessing = false;
    }
  }
}
