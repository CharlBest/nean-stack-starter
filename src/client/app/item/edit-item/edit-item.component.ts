import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CreateOrUpdateItemViewModel } from '../../../../shared/view-models/item/create-or-update-item.view-model';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { FirebaseStorageService } from '../../shared/services/firebase-storage.service';
import { ItemFormComponent } from '../item-form/item-form.component';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {

  @ViewChild('itemForm') itemForm: ItemFormComponent;
  itemUId: string | null;
  isProcessing = true;
  item: ItemViewModel;
  savedMedia: Array<string>;

  constructor(public formErrorsService: FormErrorsService,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private firebaseStorageService: FirebaseStorageService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('uId')) {
        this.itemUId = params.get('uId');
        this.getItem();
      }
    });
  }

  getItem() {
    if (this.itemUId) {
      this.isProcessing = true;

      this.itemService.get(this.itemUId)
        .pipe(finalize(() => this.isProcessing = false))
        .subscribe(data => {
          this.item = data;
          if (data.media) {
            this.savedMedia = [...data.media];
          }
        }, error => {
          this.formErrorsService.updateFormValidity(error, this.itemForm ? this.itemForm.formGroup : null);
        });
    }
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new CreateOrUpdateItemViewModel();
    viewModel.title = this.itemForm.formGroup.controls['title'].value;
    viewModel.description = this.itemForm.formGroup.controls['description'].value;
    viewModel.media = this.itemForm.formGroup.controls['media'].value;

    this.itemService.update(this.item.uId, viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.deleteRemovedImagesFromStorage();
        this.router.navigate(['/item/comments', data.uId]);
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.itemForm ? this.itemForm.formGroup : null);
      });
  }

  deleteRemovedImagesFromStorage() {
    if (this.savedMedia) {
      for (const media of this.savedMedia) {
        if (!(<Array<string>>this.itemForm.formGroup.controls['media'].value).includes(media)) {
          this.firebaseStorageService.delete(media).subscribe();
        }
      }
    }
  }
}
