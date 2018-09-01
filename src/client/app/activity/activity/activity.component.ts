import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../shared/services/notification.service';
import { WebSocketService } from '../../shared/services/websocket.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  constructor(public notificationService: NotificationService,
    private webSocketService: WebSocketService) { }

  ngOnInit() {
  }

  removeMessage(index: number) {
    this.notificationService.removeMessage(index);
  }

  manualWebSocketBroadcast() {
    this.webSocketService.send({ message: 'hello from somewhere' });
  }
}
