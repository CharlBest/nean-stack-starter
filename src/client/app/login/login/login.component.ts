import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, trimString } from '../../../../shared/validation/validators';
import { LoginViewModel } from '../../../../shared/view-models/create-user/login.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { LoginService } from '../../login/login.service';
import { AuthService } from '../../shared/auth.service';
import { FormService } from '../../shared/form.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  serverErrors;
  isProcessing = false;
  returnUrl = '/profile';
  tutorialTypeEnum = TutorialType;

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private formService: FormService) {
  }

  ngOnInit() {
    if (this.authService.checkLogin() && this.route.snapshot.queryParams.tut === undefined) {
      this.router.navigate(['/']);
    }

    this.buildForm();

    this.route.queryParamMap.subscribe(params => {
      if (params.has('returnUrl')) {
        this.returnUrl = params.get('returnUrl') || '/profile';
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      emailOrUsername: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new LoginViewModel();
    viewModel.emailOrUsername = trimString(this.form.get('emailOrUsername').value);
    viewModel.password = this.form.get('password').value;

    this.loginService.login(viewModel).subscribe(
      data => {
        if (data !== null && data.token !== null) {
          this.authService.setToken(data.token, data.userId);

          this.router.navigateByUrl(this.returnUrl);
        } else {
          alert('Authentication failed');
        }
      }, error => {
        this.isProcessing = false;
        this.serverErrors = this.formService.getServerErrors(error);
      });
  }
}
