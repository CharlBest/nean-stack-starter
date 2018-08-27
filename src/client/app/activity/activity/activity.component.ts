import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  constructor(public notificationService: NotificationService) { }

  ngOnInit() {
  }

  removeMessage(index: number) {
    this.notificationService.removeMessage(index);
  }
}
