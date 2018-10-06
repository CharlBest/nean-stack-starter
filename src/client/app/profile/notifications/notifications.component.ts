import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { DialogService } from '../../shared/dialog/dialog.service';
import { PushNotificationService } from '../../shared/services/push-notification.service';

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

  constructor(private pushNotificationService: PushNotificationService,
    private dialogService: DialogService) { }

  ngOnInit() { }

  toggleChange(event: MatSlideToggleChange) {
    if (event.checked) {
      this.dialogService.confirm('Are you sure you would like to receive push notifications?').subscribe(data => {
        if (data) {
          this.pushNotificationService.subscribeToNotifications();
        } else {
          event.source.checked = false;
        }
      });
    }
  }
}
