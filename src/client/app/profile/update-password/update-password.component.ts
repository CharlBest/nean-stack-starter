import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdatePasswordViewModel } from '@shared/view-models/profile/update-password.view-model';
import { TutorialType } from '@shared/view-models/tutorial/tutorial-type.enum';
import { FormGroupBuilder } from '../../../../shared/validation/form-group-builder';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { PasswordStrengthService } from '../../shared/password-strength/password-strength.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  @ViewChild(FormGroupDirective, { static: true }) formRef: FormGroupDirective;
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
    this.formGroup = this.fb.group(FormGroupBuilder.updatePassword());

    const confirmPasswordControl = this.formGroup.controls.confirmPassword;
    confirmPasswordControl.statusChanges.subscribe(data => {
      if (!confirmPasswordControl.errors) {
        if (this.formGroup.controls.newPassword.value !== confirmPasswordControl.value) {
          confirmPasswordControl.setErrors([{ passwordCompare: true }]);
        }
      }
    });
  }

  async onSubmit() {
    if (this.formGroup.controls.newPassword.value !== this.formGroup.controls.confirmPassword.value) {
      return;
    }

    const passedCommonlyUsedTest = await this.passwordStrengthService.passCommonlyUsedTest(this.formGroup.controls.newPassword.value);
    if (passedCommonlyUsedTest) {
      this.updatePassword();
    }
  }

  async updatePassword() {
    this.isProcessing = true;

    this.snackBar.open('Updating password...');

    const viewModel = new UpdatePasswordViewModel();
    viewModel.password = this.formGroup.controls.password.value;
    viewModel.newPassword = this.formGroup.controls.newPassword.value;

    try {
      const response = await this.profileService.updatePassword(viewModel);
      this.formRef.resetForm();

      this.snackBar.dismiss();
      this.snackBar.open('Updated password');
    } catch (error) {
      this.snackBar.dismiss();
      this.snackBar.open('Update failed');

      this.formErrorsService.updateFormValidity(error, this.formGroup);
      this.snackBar.dismiss();
    } finally {
      this.isProcessing = false;
    }
  }
}
