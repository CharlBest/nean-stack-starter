import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../shared/websocket.service';

@Component({
  selector: 'app-webhooks',
  templateUrl: './webhooks.component.html',
  styleUrls: ['./webhooks.component.scss']
})
export class WebhooksComponent implements OnInit {

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
  }

  manualWebSocketBroadcast() {
    this.webSocketService.messages.next('hallo from somewhere');
  }
}
