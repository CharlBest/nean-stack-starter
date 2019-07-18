import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateOrUpdateItemViewModel } from '@shared/view-models/item/create-or-update-item.view-model';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { PushNotificationService } from '../../shared/services/push-notification.service';
import { ItemFormComponent } from '../item-form/item-form.component';
import { ItemService } from '../item.service';

@Component({
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {

  @ViewChild('itemForm', { static: true }) itemForm: ItemFormComponent;
  isProcessing = false;

  constructor(public formErrorsService: FormErrorsService,
    private itemService: ItemService,
    private router: Router,
    private pushNotificationService: PushNotificationService,
    private dialogService: DialogService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const itemViewModel = new ItemViewModel();
    itemViewModel.title = this.route.snapshot.queryParams.title;
    itemViewModel.description = this.route.snapshot.queryParams.text;
    // const url = this.route.snapshot.queryParams.url;

    this.itemForm.item = itemViewModel;
  }

  async onSubmit() {
    this.isProcessing = true;

    const viewModel = new CreateOrUpdateItemViewModel();
    viewModel.title = this.itemForm.formGroup.controls.title.value;
    viewModel.description = this.itemForm.formGroup.controls.description.value;
    viewModel.media = this.itemForm.formGroup.controls.media.value;

    try {
      const response = await this.itemService.create(viewModel);
      if (response) {
        if (!this.pushNotificationService.isPushNotificationPermissionGrandted()) {
          this.askForNotificationPermission(response);
        }
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.itemForm ? this.itemForm.formGroup : null);
    } finally {
      this.isProcessing = false;
    }
  }

  async askForNotificationPermission(item: ItemViewModel) {
    const hasConfirmed = await this.dialogService.confirm('Give permission to get notifications for comments?');
    if (hasConfirmed) {
      this.router.navigate(['/profile/notifications']);
    } else {
      this.router.navigate(['/item/comments', item.uId]);
    }
  }
}
