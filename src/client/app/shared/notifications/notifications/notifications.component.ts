import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { BreakpointService } from '../../breakpoint.service';
import { WebSocketService } from '../../websocket.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  isOpen = false;
  messages = [];

  constructor(private webSocketService: WebSocketService,
    private snackBar: MatSnackBar,
    private bpService: BreakpointService) { }

  ngOnInit() {
    // SnackBar
    this.webSocketService.messages.subscribe((data) => {
      this.snackBar.open(data, 'Say hallo back', {
        duration: 5000,
        verticalPosition: this.bpService.isWeb ? 'top' : 'bottom',
        horizontalPosition: this.bpService.isWeb ? 'right' : 'center'
      }).onAction().subscribe(() => {
        this.webSocketService.messages.next('Hallo to you too');
      });
    });

    // Panel
    this.webSocketService.messages.subscribe((data) => {
      this.messages.push(data);
    });
  }
}
