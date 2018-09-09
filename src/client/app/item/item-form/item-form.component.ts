import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { FirebaseStorageService } from '../../shared/services/firebase-storage.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {

  @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>();
  @Input() item: ItemViewModel;
  formGroup: FormGroup;
  isProcessing = false;
  deleteSubscription: Subscription;

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private firebaseStorageService: FirebaseStorageService) { }

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
    const control = this.formGroup.get('media');
    if (control.value && control.value.length > 0) {
      control.value.push(downloadURL);
    } else {
      control.setValue([downloadURL]);
    }
  }

  removeMedia(index: number) {
    const mediaUrl = this.formGroup.get('media').value[index];
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
    this.deleteSubscription = this.firebaseStorageService.delete(mediaUrl).subscribe();

    this.formGroup.get('media').value.splice(index, 1);
  }
}
