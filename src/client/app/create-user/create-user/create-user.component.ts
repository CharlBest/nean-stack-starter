import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup, trimString } from '../../../../shared/validation/validators';
import { CreateUserViewModel } from '../../../../shared/view-models/create-user/create-user.view-model';
import { LoginViewModel } from '../../../../shared/view-models/create-user/login.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { LoginService } from '../../login/login.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { CreateUserService } from '../create-user.service';
import { passwordList } from '../password-list.model';

@Component({
  selector: 'app-create-user',
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
    private dialogService: DialogService) {
  }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.createUser());
  }

  onSubmit() {
    if (passwordList.includes(this.formGroup.get('password').value)) {
      this.dialogService.confirm('It seems your password is weak. Would you like to proceed?', 'Yes', 'No').subscribe(data => {
        if (data) {
          this.createUser();
        }
      });
    } else {
      this.createUser();
    }
  }

  createUser() {
    this.isProcessing = true;

    const viewModel = new CreateUserViewModel();
    viewModel.email = trimString(this.formGroup.get('email').value);
    viewModel.username = trimString(this.formGroup.get('username').value);
    viewModel.password = this.formGroup.get('password').value;

    this.createUserService.createUser(viewModel)
      .subscribe(() => {
        this.setUserToken();
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.formGroup);
        this.isProcessing = false;
      });
  }

  setUserToken() {
    this.isProcessing = true;

    const model = new LoginViewModel();
    model.emailOrUsername = this.formGroup.get('email').value;
    model.password = this.formGroup.get('password').value;

    this.loginService.login(model)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        if (data && data.token) {
          this.authService.setToken(data.token, data.userId);

          this.router.navigate(['/profile'], { queryParams: { tut: TutorialType.ProfileShare }, queryParamsHandling: 'merge' });
        } else {
          this.dialogService.alert('Authentication failed');
        }
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.formGroup);
      });
  }
}
