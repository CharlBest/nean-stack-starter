import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { MAX_FILE_UPLOADS } from '@shared/validation/validators';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { FileUploaderComponent } from '../../shared/file-uploader/file-uploader/file-uploader.component';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {

  @ViewChild('fileUploader', { static: true }) fileUploader: FileUploaderComponent;
  @Output() readonly submitForm: EventEmitter<void> = new EventEmitter<void>();
  @Input() item: ItemViewModel | null;
  formGroup: FormGroup;
  readonly MAX_FILE_UPLOADS = MAX_FILE_UPLOADS;

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService) { }

  ngOnInit() {
    this.formOnInit();

    if (this.item) {
      this.fileUploader.setImages(this.item.files);
    }
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.createOrUpdateItem(
      this.item ? this.item.title : null,
      this.item ? this.item.description : null,
      this.item ? this.item.files : null
    ));
  }

  async onSubmit() {
    const files = await this.fileUploader.upload();
    this.formGroup.controls.files.setValue(files);
    this.submitForm.emit();
  }
}
