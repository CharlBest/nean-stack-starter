import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupBuilder } from '../../../../shared/validation/form-group-builder';
import { LoginViewModel } from '../../../../shared/view-models/create-user/login.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
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

    this.getParams();
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.login());
  }

  getParams() {
    this.route.queryParamMap.subscribe(params => {
      if (params.has('returnUrl')) {
        const returnUrl = params.get('returnUrl');
        if (returnUrl) {
          this.returnUrl = returnUrl;
        }
      }
    });
  }

  async onSubmit() {
    this.isProcessing = true;

    const viewModel = new LoginViewModel();
    viewModel.emailOrUsername = this.formGroup.controls.emailOrUsername.value.trim();
    viewModel.password = this.formGroup.controls.password.value;

    try {
      const response = await this.loginService.login(viewModel);
      if (response && response.token) {
        this.authService.setToken(response.token);

        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.dialogService.alert('Authentication failed');
        this.isProcessing = false;
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.formGroup);
      this.isProcessing = false;
    }
  }
}
