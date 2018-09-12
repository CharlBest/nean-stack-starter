import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { UpdatePasswordViewModel } from '../../../../shared/view-models/profile/update-password.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { PasswordStrengthService } from '../../shared/password-strength/password-strength.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  @ViewChild(FormGroupDirective) formRef: FormGroupDirective;
  formGroup: FormGroup;
  isProcessing = false;
  tutorialTypeEnum = TutorialType;

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private passwordStrengthService: PasswordStrengthService) { }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.updatePassword());
  }

  onSubmit() {
    if (this.formGroup.get('newPassword').value !== this.formGroup.get('confirmPassword').value) {
      this.formGroup.get('confirmPassword').setErrors([{ passwordCompare: false }]);
      return;
    }

    this.passwordStrengthService.init(this.formGroup.get('newPassword').value).subscribe(data => {
      if (data) {
        this.updatePassword();
      }
    });
  }

  updatePassword() {
    this.isProcessing = true;

    this.snackBar.open('Updating password...');

    const viewModel = new UpdatePasswordViewModel();
    viewModel.password = this.formGroup.get('password').value;
    viewModel.newPassword = this.formGroup.get('newPassword').value;

    this.profileService.updatePassword(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.formRef.resetForm();

        this.snackBar.dismiss();
        this.snackBar.open('Updated password');
      }, error => {
        this.snackBar.dismiss();
        this.snackBar.open('Update failed');

        this.formErrorsService.updateFormValidity(error, this.formGroup);
        this.snackBar.dismiss();
      });
  }
}
