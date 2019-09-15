import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { MAX_MEDIA_UPLOADS } from '@shared/validation/validators';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { UploadButtonComponent } from '../../shared/upload-button/upload-button/upload-button.component';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {

  @ViewChild('fileUploader', { static: true }) fileUploader: UploadButtonComponent;
  @Output() submitForm: EventEmitter<void> = new EventEmitter<void>();
  @Input() item: ItemViewModel;
  formGroup: FormGroup;
  readonly MAX_MEDIA_UPLOADS = MAX_MEDIA_UPLOADS;

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.createOrUpdateItem(
      this.item ? this.item.title : null,
      this.item ? this.item.description : null,
      this.item ? this.item.media : null
    ));
  }

  async onSubmit() {
    const media = await this.fileUploader.upload();
    this.formGroup.controls.media.setValue(media);
    this.submitForm.emit();
  }

  async removeMedia(index: number) {
    const hasConfirmed = await this.dialogService.confirm('Are you sure?');
    if (hasConfirmed) {
      this.formGroup.controls.media.value.splice(index, 1);
    }
  }
}
