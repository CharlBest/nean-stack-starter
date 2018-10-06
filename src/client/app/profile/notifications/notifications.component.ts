import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { PushNotificationService } from '../../shared/services/push-notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  // TODO: not sure if Notification.permission is supported by all browsers
  pushNotificationPermissionGrandted = (<any>Notification).permission === 'granted';

  constructor(private pushNotificationService: PushNotificationService) { }

  ngOnInit() {
  }

  toggleChange(event: MatSlideToggleChange) {
    if (event.checked) {
      this.pushNotificationService.subscribeToNotifications();
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
