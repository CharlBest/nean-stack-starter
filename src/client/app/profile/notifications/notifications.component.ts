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

  // TODO: not sure if Notification.permission is supported by all browsers
  pushNotificationPermissionGrandted = (<any>Notification).permission === 'granted';

  constructor(private pushNotificationService: PushNotificationService,
    private dialogService: DialogService) { }

  ngOnInit() { }

  toggleChange(event: MatSlideToggleChange) {
    if (event.checked) {
      this.dialogService.confirm('Are you sure you would like to receive push notifications?').subscribe(data => {
        if (data) {
          this.pushNotificationService.subscribeToNotifications();
        }
      });
      // TODO: nothing is being done with this subscription
      // Notification.requestPermission().then((result) => {
      //   if (result === 'denied') {
      //     console.log('Permission was not granted. Allow a retry.');
      //     event.source.writeValue(false);
      //     return;
      //   }
      //   if (result === 'default') {
      //     console.log('The permission request was dismissed.');
      //     event.source.writeValue(false);
      //     return;
      //   }
      //   // TODO: Do something with the granted permission.
      // });
    }
  }
}
