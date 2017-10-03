import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdSnackBar } from '@angular/material';
import { UserModel } from '../../../../server/models/user/user.model';
import { ProfileService } from '../profile.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '../../shared/form.service';
import { Validators } from '../../../../server/validation/validators';
import { UpdateBioViewModel } from '../../../../server/view-models/profile/update-bio.view-model';

@Component({
  selector: 'app-update-bio',
  templateUrl: './update-bio.component.html',
  styleUrls: ['./update-bio.component.scss']
})
export class UpdateBioComponent implements OnInit {

  form: FormGroup;
  serverErrors;
  isProcessing = false;
  @Input() content = '';

  constructor(private fb: FormBuilder,
    private formService: FormService,
    private profileService: ProfileService,
    public snackBar: MdSnackBar) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      content: [this.content]
    });
  }

  onSubmit() {
    const viewModel = new UpdateBioViewModel();
    viewModel.content = this.form.get('content').value;

    if (this.content !== viewModel.content) {
      this.isProcessing = true;

      this.snackBar.open('Updating bio...', '', {
        duration: 10000,
      });

      this.profileService.updateBio(viewModel).subscribe(
        data => {
          this.isProcessing = false;
          this.content = viewModel.content;

          this.snackBar.dismiss();
          this.snackBar.open('Updated bio', '', {
            duration: 2000,
          });
        }, error => {
          this.isProcessing = false;
          this.serverErrors = this.formService.getServerErrors(error);

          this.snackBar.dismiss();
        });
    }
  }
}
