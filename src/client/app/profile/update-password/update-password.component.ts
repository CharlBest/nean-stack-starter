import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Validators } from '../../../../shared/validation/validators';
import { UpdatePasswordViewModel } from '../../../../shared/view-models/profile/update-password.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { FormService } from '../../shared/form.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  form: FormGroup;
  serverErrors;
  isProcessing = false;
  tutorialTypeEnum = TutorialType;

  constructor(private fb: FormBuilder,
    private formService: FormService,
    private profileService: ProfileService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  onSubmit() {
    this.isProcessing = true;

    if (this.form.get('newPassword').value !== this.form.get('confirmPassword').value) {
      this.form.get('confirmPassword').setErrors([{ message: 'passwords don\'t match' }]);

      this.isProcessing = false;
      return;
    }

    this.snackBar.open('Updating password...', '', {
      duration: 10000,
    });

    const viewModel = new UpdatePasswordViewModel();
    viewModel.password = this.form.get('password').value;
    viewModel.newPassword = this.form.get('newPassword').value;

    this.profileService.updatePassword(viewModel).subscribe(
      data => {
        this.isProcessing = false;
        this.form.reset();

        this.snackBar.dismiss();
        this.snackBar.open('Updated password', '', {
          duration: 2000,
        });
      }, error => {
        this.isProcessing = false;
        this.serverErrors = this.formService.getServerErrors(error);

        this.snackBar.dismiss();
      });
  }
}
