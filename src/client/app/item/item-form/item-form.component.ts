import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { MAX_FILE_UPLOADS } from '@shared/validation/validators';
import { CreateOrUpdateItemViewModel } from '@shared/view-models/item/create-or-update-item.view-model';
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
  @Output() readonly submitForm: EventEmitter<CreateOrUpdateItemViewModel> = new EventEmitter<CreateOrUpdateItemViewModel>();
  @Input() item: ItemViewModel | null;
  formGroup: FormGroup;
  readonly MAX_FILE_UPLOADS = MAX_FILE_UPLOADS;
  // Enter, comma, semi-colon
  readonly separatorKeysCodes = [ENTER, COMMA, 186];

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService) { }

  ngOnInit(): void {
    this.formOnInit();

    if (this.item) {
      this.fileUploader.setImages(this.item.files);
    }
  }

  formOnInit(): void {
    this.formGroup = this.fb.group(FormGroupBuilder.createOrUpdateItem(
      this.item ? this.item.title : null,
      this.item ? this.item.description : null,
      this.item ? this.item.files : null,
      this.item ? this.item.tags : [],
    ));
  }

  addTag(event: MatChipInputEvent): void {
    const { input, value } = event;

    // Add our fruit
    if ((value || '').trim()) {
      this.formGroup.controls.tags.value.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.formGroup.controls.tags.value.indexOf(tag);

    if (index >= 0) {
      this.formGroup.controls.tags.value.splice(index, 1);
    }
  }

  async onSubmit(): Promise<void> {
    const files = await this.fileUploader.upload();

    const viewModel = new CreateOrUpdateItemViewModel();
    viewModel.title = this.formGroup.controls.title.value;
    viewModel.description = this.formGroup.controls.description.value;
    viewModel.files = files;
    viewModel.tags = this.formGroup.controls.tags.value;

    this.submitForm.emit(viewModel);
  }

  trackByFn(index: number, item: string): number {
    return index;
  }
}
