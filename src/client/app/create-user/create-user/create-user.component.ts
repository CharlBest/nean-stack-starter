import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup, trimString } from '../../../../shared/validation/validators';
import { CreateUserViewModel } from '../../../../shared/view-models/create-user/create-user.view-model';
import { LoginViewModel } from '../../../../shared/view-models/create-user/login.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { LoginService } from '../../login/login.service';
import { AuthService } from '../../shared/auth.service';
import { BreakpointService } from '../../shared/breakpoint.service';
import { FormService } from '../../shared/form-errors/form-errors.service';
import { CreateUserService } from '../create-user.service';

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
    private formService: FormService,
    public bpService: BreakpointService) {
  }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.createUser());
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new CreateUserViewModel();
    viewModel.email = trimString(this.formGroup.get('email').value);
    viewModel.username = trimString(this.formGroup.get('username').value);
    viewModel.password = this.formGroup.get('password').value;

    this.createUserService.createUser(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.setUserToken();
      }, error => {
        this.formService.updateFormValidity(error, this.formGroup);
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
        if (data !== null && data.token !== null) {
          this.authService.setToken(data.token, data.userId);

          this.router.navigate(['/profile'], { queryParams: { tut: TutorialType.ProfileShare } });
        } else {
          // TODO: show material dialog (shared auth failed dialog)
          alert('Authentication failed');
        }
      }, error => {
        this.formService.updateFormValidity(error, this.formGroup);
      });
  }
}
