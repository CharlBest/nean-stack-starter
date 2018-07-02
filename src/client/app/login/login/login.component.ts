import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/new-validators';
import { trimString } from '../../../../shared/validation/validators';
import { LoginViewModel } from '../../../../shared/view-models/create-user/login.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { LoginService } from '../../login/login.service';
import { AuthService } from '../../shared/auth.service';
import { BreakpointService } from '../../shared/breakpoint.service';
import { FormService } from '../../shared/form.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;
  isProcessing = false;
  returnUrl = '/profile';
  tutorialTypeEnum = TutorialType;

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private formService: FormService,
    public bpService: BreakpointService) {
  }

  ngOnInit() {
    if (this.authService.checkLogin() && this.route.snapshot.queryParams.tut === undefined) {
      this.router.navigate(['/']);
    }

    this.formOnInit();

    this.route.queryParamMap.subscribe(params => {
      if (params.has('returnUrl')) {
        this.returnUrl = params.get('returnUrl') || '/profile';
      }
    });
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.login());
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new LoginViewModel();
    viewModel.emailOrUsername = trimString(this.formGroup.get('emailOrUsername').value);
    viewModel.password = this.formGroup.get('password').value;

    this.loginService.login(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        if (data !== null && data.token !== null) {
          this.authService.setToken(data.token, data.userId);

          this.router.navigateByUrl(this.returnUrl);
        } else {
          alert('Authentication failed');
        }
      }, (error) => {
        this.formService.applyServerErrorValidationOnForm(error, this.formGroup);
      });
  }
}
