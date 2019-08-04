import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateOrUpdateItemViewModel } from '@shared/view-models/item/create-or-update-item.view-model';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { FirebaseStorageService } from '../../shared/services/firebase-storage.service';
import { ItemFormComponent } from '../item-form/item-form.component';
import { ItemService } from '../item.service';

@Component({
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {

  @ViewChild('itemForm', { static: false }) itemForm: ItemFormComponent;
  isProcessing = false;
  item: ItemViewModel;
  savedMedia: Array<string>;

  constructor(public formErrorsService: FormErrorsService,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private firebaseStorageService: FirebaseStorageService,
    private navigationService: NavigationService) { }

  ngOnInit() {
    // TODO: not sure if there is a maximum stack size for state on browser history. Investigate?
    this.item = history.state.item;

    this.getParams();
  }

  getParams() {
    const itemUId = this.route.snapshot.params.uId;
    if (!this.item) {
      this.getItem(itemUId);
    }
  }

  async getItem(itemUId: string | null) {
    if (itemUId) {
      this.isProcessing = true;

      try {
        const response = await this.itemService.get(itemUId);
        if (response) {
          this.item = response;
          if (response.media) {
            this.savedMedia = [...response.media];
          }
        }
      } catch (error) {
        this.formErrorsService.updateFormValidity(error, this.itemForm ? this.itemForm.formGroup : null);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  async onSubmit() {
    this.isProcessing = true;

    const viewModel = new CreateOrUpdateItemViewModel();
    viewModel.title = this.itemForm.formGroup.controls.title.value;
    viewModel.description = this.itemForm.formGroup.controls.description.value;
    viewModel.media = this.itemForm.formGroup.controls.media.value;

    try {
      const response = await this.itemService.update(this.item.uId, viewModel);
      if (response) {
        // TODO: should actually go to previous page before this.
        this.navigationService.backRouterPath = '/';

        this.deleteRemovedImagesFromStorage();
        this.router.navigate(['/item/comments', response.uId]);
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.itemForm ? this.itemForm.formGroup : null);
    } finally {
      this.isProcessing = false;
    }
  }

  deleteRemovedImagesFromStorage() {
    if (this.savedMedia) {
      for (const media of this.savedMedia) {
        if (!(this.itemForm.formGroup.controls.media.value as Array<string>).includes(media)) {
          this.firebaseStorageService.delete(media)
            .catch(error => {
              // TODO: error handling
            });
        }
      }
    }
  }
}
