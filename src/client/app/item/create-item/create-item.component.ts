import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CreateOrUpdateItemViewModel } from '../../../../shared/view-models/item/create-or-update-item.view-model';
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
    private dialogService: DialogService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new CreateOrUpdateItemViewModel();
    viewModel.title = this.itemForm.formGroup.controls.title.value;
    viewModel.description = this.itemForm.formGroup.controls.description.value;
    viewModel.media = this.itemForm.formGroup.controls.media.value;

    this.itemService.create(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        if (data) {
          if (!this.pushNotificationService.isPushNotificationPermissionGrandted()) {
            this.dialogService.confirm('Give permission to get notifications for comments?')
              .subscribe(confirm => {
                if (confirm) {
                  this.router.navigate(['/profile/notifications']);
                } else {
                  this.router.navigate(['/item/comments', data.uId]);
                }
              });
          }
        }
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.itemForm ? this.itemForm.formGroup : null);
      });
  }
}
