import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../websocket.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  isOpen = false;
  messages = [];
  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.webSocketService.messages.subscribe((data) => {
      this.messages.push(data);
    });
  }
}
