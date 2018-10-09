import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange, MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { UserProfileViewModel } from 'shared/view-models/user/user-profile.view-model';
import { NotificationPreferencesModel } from '../../../../shared/models/user/notification-preferences.model';
import { BuildFormGroup } from '../../../../shared/validation/validators';
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

  // TODO: At the moment this only supports 1 device which means the user will
  // receive push notifications on the device the toggle this switch on and it
  // will override any other devices that are registered to receive push notifications
  // The toggle state also doesn't represent that it is the current registered device
  // but only that this user has permitted the use of push notifcations
  pushNotificationPermissionGrandted = (<any>Notification).permission === 'granted';
  @Input() user: UserProfileViewModel;
  formGroup: FormGroup;
  isProcessing = false;

  constructor(private fb: FormBuilder,
    private pushNotificationService: PushNotificationService,
    private dialogService: DialogService,
    private profileService: ProfileService,
    private formErrorsService: FormErrorsService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.formOnInit();
  }

  toggleChange(event: MatSlideToggleChange) {
    if (event.checked) {
      this.dialogService.confirm('Are you sure you would like to receive push notifications?').subscribe(data => {
        if (data) {
          this.pushNotificationService.subscribeToNotifications();
        } else {
          event.source.checked = false;
        }
      });
    } else {
      event.source.checked = false;
      this.snackBar.open('Updating notification preferences...');

      this.pushNotificationService.deletePushSubscription()
        .subscribe(() => {
          this.user.hasPushSubscription = false;
          this.snackBar.dismiss();
          this.snackBar.open('Updated notification preferences');
        }, error => {
          event.source.checked = true;

          this.snackBar.dismiss();
          this.snackBar.open('Update failed');

          this.formErrorsService.updateFormValidity(error);
          this.snackBar.dismiss();
        });
    }
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.updateNotificationPreferences(this.user.nt1, this.user.nt2));
  }

  onSubmit() {
    this.isProcessing = true;
    const viewModel: NotificationPreferencesModel = {
      nt1: this.formGroup.controls['nt1'].value,
      nt2: this.formGroup.controls['nt2'].value
    };

    this.snackBar.open('Updating notification preferences...');

    this.profileService.updateNotificationPreferences(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.snackBar.dismiss();
        this.snackBar.open('Updated notification preferences');
      }, error => {
        this.snackBar.dismiss();
        this.snackBar.open('Update failed');

        this.formErrorsService.updateFormValidity(error);
        this.snackBar.dismiss();
      });
  }
}
