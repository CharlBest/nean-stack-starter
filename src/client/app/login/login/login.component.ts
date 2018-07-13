import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup, trimString } from '../../../../shared/validation/validators';
import { LoginViewModel } from '../../../../shared/view-models/create-user/login.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { LoginService } from '../../login/login.service';
import { AuthService } from '../../shared/auth.service';
import { BreakpointService } from '../../shared/breakpoint.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';

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
  @ViewChild('authenticationFailedDialog') authenticationFailedDialog: TemplateRef<ElementRef>;

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private dialog: MatDialog) {
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
          this.dialog.open(this.authenticationFailedDialog);
        }
      }, (error) => {
        this.formErrorsService.updateFormValidity(error, this.formGroup);
      });
  }
}
