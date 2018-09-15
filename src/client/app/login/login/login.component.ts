import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { LoginViewModel } from '../../../../shared/view-models/create-user/login.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { LoginService } from '../../login/login.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';

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
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private dialogService: DialogService) {
  }

  ngOnInit() {
    if (this.authService.hasToken() && !this.route.snapshot.queryParams.tut) {
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
    viewModel.emailOrUsername = this.formGroup.get('emailOrUsername').value.trim();
    viewModel.password = this.formGroup.get('password').value;

    this.loginService.login(viewModel)
      .subscribe(data => {
        if (data && data.token) {
          this.authService.setToken(data.token);

          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.dialogService.alert('Authentication failed');
          this.isProcessing = false;
        }
      }, (error) => {
        this.formErrorsService.updateFormValidity(error, this.formGroup);
        this.isProcessing = false;
      });
  }
}
