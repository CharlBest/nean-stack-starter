import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { Validators } from '@shared/validation/validators';
import { UpdatePasswordViewModel } from '@shared/view-models/profile/update-password.view-model';
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

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private passwordStrengthService: PasswordStrengthService) { }

  ngOnInit(): void {
    this.formOnInit();
  }

  formOnInit(): void {
    this.formGroup = this.fb.group(FormGroupBuilder.updatePassword());

    // Show individually which characters are required (only for UI)
    this.formGroup.controls.newPassword.setValidators(this.formGroup.controls.newPassword.validator ?
      [this.formGroup.controls.newPassword.validator, Validators.passwordCharacters] : Validators.passwordCharacters);

    const confirmPasswordControl = this.formGroup.controls.confirmPassword;
    confirmPasswordControl.statusChanges.subscribe(data => {
      if (!confirmPasswordControl.errors && this.formGroup.controls.newPassword.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors([{ passwordCompare: true }]);
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.controls.newPassword.value !== this.formGroup.controls.confirmPassword.value) {
      return;
    }

    const passedCommonlyUsedTest = await this.passwordStrengthService.passCommonlyUsedTest(this.formGroup.controls.newPassword.value);
    if (passedCommonlyUsedTest) {
      this.updatePassword();
    }
  }

  async updatePassword(): Promise<void> {
    this.isProcessing = true;

    this.snackBar.open('Updating password...');

    const viewModel = new UpdatePasswordViewModel();
    viewModel.password = this.formGroup.controls.password.value;
    viewModel.newPassword = this.formGroup.controls.newPassword.value;

    try {
      await this.profileService.updatePassword(viewModel);
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
