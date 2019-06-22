import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { NotificationPreferencesViewModel } from '../../../../shared/view-models/user/notification-preferences.view-model';
import { PushSubscriptionViewModel } from '../../../../shared/view-models/user/push-subscription.view-model';
import { UpdateNotificationPreferencesViewModel } from '../../../../shared/view-models/user/update-notification-preferences.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { PushNotificationService } from '../../shared/services/push-notification.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notificationPreferences: NotificationPreferencesViewModel;
  formGroup: FormGroup;
  isProcessing = true;

  constructor(private fb: FormBuilder,
    private pushNotificationService: PushNotificationService,
    private dialogService: DialogService,
    private profileService: ProfileService,
    private formErrorsService: FormErrorsService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getNotificationPreferences();
  }

  getNotificationPreferences() {
    this.profileService.getNotificationPreferences()
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        if (data) {
          this.notificationPreferences = data;
          this.formOnInit();
        }
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.updateNotificationPreferences(
      this.notificationPreferences.pushNotificationEnabled &&
        this.pushNotificationService.isPushNotificationPermissionGrandted() ? true : false,
      this.notificationPreferences.emailEnabled ? true : false,

      this.notificationPreferences.autoSubscribeToItem === false ? false : true,

      this.notificationPreferences.pushNewComment === false ? false : true,
      this.notificationPreferences.pushHot === false ? false : true,
      this.notificationPreferences.emailNewComment === false ? false : true,
      this.notificationPreferences.emailHot === false ? false : true
    ));

    this.formGroup.controls.pushNotificationEnabled.valueChanges.subscribe(data => {
      this.togglePushNotification(data);
    });
    this.formGroup.controls.emailEnabled.valueChanges.subscribe(() => this.update());
  }

  togglePushNotification(checked: boolean) {
    if (checked) {
      this.dialogService.confirm('Are you sure you would like to receive push notifications?').subscribe(data => {
        if (data) {
          this.pushNotificationService.subscribeToNotifications((pushSubscription: PushSubscriptionViewModel) => {
            this.update(pushSubscription);
          });
        } else {
          this.formGroup.controls.pushNotificationEnabled.setValue(false, { emitEvent: false });
        }
      });
    } else {
      this.formGroup.controls.pushNotificationEnabled.setValue(false, { emitEvent: false });
      this.update();
    }
  }

  onSubmit() {
    this.update();
  }

  update(pushSubscription: PushSubscriptionViewModel | null = null) {
    this.isProcessing = true;

    const viewModel: UpdateNotificationPreferencesViewModel = {
      pushSubscription,
      preferences: {
        hasPushSubscription: true,
        pushNotificationEnabled: this.formGroup.controls.pushNotificationEnabled.value,
        emailEnabled: this.formGroup.controls.emailEnabled.value,
        autoSubscribeToItem: this.formGroup.controls.autoSubscribeToItem.value,
        pushNewComment: this.formGroup.controls.pushNewComment.value,
        pushHot: this.formGroup.controls.pushHot.value,
        emailNewComment: this.formGroup.controls.emailNewComment.value,
        emailHot: this.formGroup.controls.emailHot.value
      }
    };

    this.snackBar.open('Updating notification preferences...');

    this.profileService.updateNotificationPreferences(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.snackBar.dismiss();
        this.snackBar.open('Updated notification preferences');

        // TODO: little hack. Update view model
        this.notificationPreferences.autoSubscribeToItem = viewModel.preferences.autoSubscribeToItem;
      }, error => {
        this.snackBar.dismiss();
        this.snackBar.open('Update failed');

        this.formErrorsService.updateFormValidity(error, this.formGroup);
        this.snackBar.dismiss();
      });
  }
}
