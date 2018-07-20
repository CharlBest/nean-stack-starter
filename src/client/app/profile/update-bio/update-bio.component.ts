import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import * as emojione from 'emojione';
import { finalize } from 'rxjs/operators';
import { UpdateBioViewModel } from '../../../../shared/view-models/profile/update-bio.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { HTMLEditorComponent } from '../../shared/html-editor/html-editor/html-editor.component';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-update-bio',
  templateUrl: './update-bio.component.html',
  styleUrls: ['./update-bio.component.scss']
})
export class UpdateBioComponent implements OnChanges {

  @ViewChild('htmlEditor') htmlEditor: HTMLEditorComponent;
  isProcessing = false;
  @Input() content = '';

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    private profileService: ProfileService,
    public snackBar: MatSnackBar) { }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'content') {
        if (this.content !== null && this.content !== undefined && this.content !== '') {
          this.loadEmoji();
        }
      }
    }
  }

  loadEmoji() {
    // (<any>emojione).ascii = true;
    (<any>emojione).sprites = true;
    (<any>emojione).imagePathSVGSprites = './assets/emoji/';
    const output = emojione.shortnameToImage(this.content);
    this.content = output;
  }

  emojiInserted(shortname: string) {
    this.htmlEditor.insertText(shortname);
    this.loadEmoji();
  }

  onSubmit() {
    const viewModel = new UpdateBioViewModel();
    viewModel.content = this.htmlEditor.editorDomElement.nativeElement.innerHTML;

    if (this.content !== viewModel.content) {
      this.isProcessing = true;

      this.snackBar.open('Updating bio...', null, {
        duration: 10000,
      });

      this.profileService.updateBio(viewModel)
        .pipe(finalize(() => this.isProcessing = false))
        .subscribe(() => {
          this.content = viewModel.content;

          this.snackBar.dismiss();
          this.snackBar.open('Updated bio', null, {
            duration: 2000,
          });
        }, error => {
          this.snackBar.dismiss();
          this.snackBar.open('Update failed', null, {
            duration: 2000,
          });

          this.formErrorsService.updateFormValidity(error);
          this.snackBar.dismiss();
        });
    }
  }
}
