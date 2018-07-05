import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { UpdateBioViewModel } from '../../../../shared/view-models/profile/update-bio.view-model';
import { FormService } from '../../shared/form-errors/form-errors.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-update-bio',
  templateUrl: './update-bio.component.html',
  styleUrls: ['./update-bio.component.scss']
})
export class UpdateBioComponent implements OnInit {

  formGroup: FormGroup;
  isProcessing = false;
  @Input() content = '';
  inputElement: HTMLDivElement;

  constructor(private fb: FormBuilder,
    private formService: FormService,
    private profileService: ProfileService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  onSubmit() {
    const viewModel = new UpdateBioViewModel();
    viewModel.content = this.inputElement.innerHTML;

    if (this.content !== viewModel.content) {
      this.isProcessing = true;

      this.snackBar.open('Updating bio...', '', {
        duration: 10000,
      });

      this.profileService.updateBio(viewModel)
        .pipe(finalize(() => this.isProcessing = false))
        .subscribe(() => {
          this.content = viewModel.content;

          this.snackBar.dismiss();
          this.snackBar.open('Updated bio', '', {
            duration: 2000,
          });
        }, error => {
          this.formService.updateFormValidity(error, this.formGroup);
          this.snackBar.dismiss();
        });
    }
  }
}
