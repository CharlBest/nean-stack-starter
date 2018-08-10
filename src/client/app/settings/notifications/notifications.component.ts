import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../shared/websocket.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
  }

  manualWebSocketBroadcast() {
    this.webSocketService.messages.next('hello from somewhere');
  }
}
