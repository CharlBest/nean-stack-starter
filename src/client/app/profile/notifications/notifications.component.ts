import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { NotificationPreferencesViewModel } from '@shared/view-models/user/notification-preferences.view-model';
import { PushSubscriptionViewModel } from '@shared/view-models/user/push-subscription.view-model';
import { UpdateNotificationPreferencesViewModel } from '@shared/view-models/user/update-notification-preferences.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { PushNotificationService } from '../../shared/services/push-notification.service';
import { ProfileService } from '../profile.service';

@Component({
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notificationPreferences: NotificationPreferencesViewModel;
  formGroup: FormGroup;
  isProcessing = true;
  showAdvancedOptions = false;

  constructor(private fb: FormBuilder,
    private pushNotificationService: PushNotificationService,
    private dialogService: DialogService,
    private profileService: ProfileService,
    private formErrorsService: FormErrorsService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getNotificationPreferences();
  }

  async getNotificationPreferences() {
    try {
      const response = await this.profileService.getNotificationPreferences();
      if (response) {
        this.notificationPreferences = response;
        this.formOnInit();
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    } finally {
      this.isProcessing = false;
    }
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.updateNotificationPreferences(
      !!(this.notificationPreferences.pushNotificationEnabled && this.pushNotificationService.isPushNotificationPermissionGrandted()),
      !!this.notificationPreferences.emailEnabled,

      typeof this.notificationPreferences.autoSubscribeToItem === 'boolean' ? this.notificationPreferences.autoSubscribeToItem : true,

      typeof this.notificationPreferences.pushNewComment === 'boolean' ? this.notificationPreferences.pushNewComment : true,
      typeof this.notificationPreferences.pushHot === 'boolean' ? this.notificationPreferences.pushHot : true,
      typeof this.notificationPreferences.emailNewComment === 'boolean' ? this.notificationPreferences.emailNewComment : true,
      typeof this.notificationPreferences.emailHot === 'boolean' ? this.notificationPreferences.emailHot : true,
    ));

    this.formGroup.controls.pushNotificationEnabled.valueChanges.subscribe(data => {
      this.togglePushNotification(data);
    });
    this.formGroup.controls.emailEnabled.valueChanges.subscribe(() => this.update());
  }

  async togglePushNotification(checked: boolean) {
    if (checked) {
      const hasConfirmed = await this.dialogService.confirm('Are you sure you would like to receive push notifications?');
      if (hasConfirmed) {
        this.pushNotificationService.subscribeToNotifications((pushSubscription: PushSubscriptionViewModel) => {
          this.update(pushSubscription);
        });
      } else {
        this.formGroup.controls.pushNotificationEnabled.setValue(false, { emitEvent: false });
      }
    } else {
      this.formGroup.controls.pushNotificationEnabled.setValue(false, { emitEvent: false });
      this.update();
    }
  }

  onSubmit() {
    this.update();
  }

  async update(pushSubscription: PushSubscriptionViewModel | null = null) {
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

    try {
      await this.profileService.updateNotificationPreferences(viewModel);

      this.snackBar.dismiss();
      this.snackBar.open('Updated notification preferences');

      // TODO: little hack. Update view model
      this.notificationPreferences.autoSubscribeToItem = viewModel.preferences.autoSubscribeToItem;
    } catch (error) {
      this.snackBar.dismiss();
      this.snackBar.open('Update failed');

      this.formErrorsService.updateFormValidity(error, this.formGroup);
      this.snackBar.dismiss();
    } finally {
      this.isProcessing = false;
    }
  }
}
