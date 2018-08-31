import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  pushNotificationPermissionGrandted = (<any>Notification).permission === 'granted';

  constructor() { }

  ngOnInit() {
  }

  toggleChange(event: MatSlideToggleChange) {
    if (event.checked) {
      // TODO: nothing is being done with this subscription
      Notification.requestPermission().then((result) => {
        if (result === 'denied') {
          console.log('Permission was not granted. Allow a retry.');
          event.source.writeValue(false);
          return;
        }
        if (result === 'default') {
          console.log('The permission request was dismissed.');
          event.source.writeValue(false);
          return;
        }
        // TODO: Do something with the granted permission.
      });
    }
  }
}
