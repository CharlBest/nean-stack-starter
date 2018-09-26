import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BuildFormGroup, MAX_MEDIA_UPLOADS } from '../../../../shared/validation/validators';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {

  @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>();
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
    this.formGroup = this.fb.group(BuildFormGroup.createOrUpdateItem(
      this.item ? this.item.title : null,
      this.item ? this.item.description : null,
      this.item ? this.item.media : null
    ));
  }

  addItemMedia(downloadURL: string) {
    const control = this.formGroup.controls['media'];
    if (control.value && control.value.length > 0) {
      control.value.push(downloadURL);
    } else {
      control.setValue([downloadURL]);
    }
  }

  removeMedia(index: number) {
    this.dialogService.confirm('Are you sure?').subscribe(data => {
      if (data) {
        this.formGroup.controls['media'].value.splice(index, 1);
      }
    });
  }
}
