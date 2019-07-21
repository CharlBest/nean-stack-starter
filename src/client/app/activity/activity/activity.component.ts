import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewSignUpWebSocketModel } from '../../../../shared/models/web-socket/new-sign-up-web-socket.model';
import { NotificationService } from '../../shared/services/notification.service';
import { WebSocketService } from '../../shared/services/websocket.service';

@Component({
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {
  constructor(public notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private snackBar: MatSnackBar) { }

  removeMessage(index: number) {
    this.notificationService.removeMessage(index);
  }

  manualWebSocketBroadcast() {
    const model = new NewSignUpWebSocketModel();
    model.message = 'hello from somewhere';
    this.webSocketService.send(model);
    this.snackBar.open('Sent');
  }
}
