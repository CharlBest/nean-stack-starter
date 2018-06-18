import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { BreakpointService } from '../../breakpoint.service';
import { WebSocketService } from '../../websocket.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @ViewChild('panel') panel: CdkConnectedOverlay;
  isOpen = false;
  messages = [];

  constructor(private webSocketService: WebSocketService,
    private snackBar: MatSnackBar,
    private bpService: BreakpointService) { }

  ngOnInit() {
    // SnackBar
    this.webSocketService.messages
      .subscribe((data) => {
        // Add messages to queue
        this.messages.push(data);

        // Show notification popup
        this.snackBar.open(data, 'Say hallo back', {
          duration: 5000,
          verticalPosition: this.bpService.isWeb ? 'top' : 'bottom',
          horizontalPosition: this.bpService.isWeb ? 'right' : 'center'
        }).onAction()
          .subscribe(() => {
            // Send message back
            this.webSocketService.messages.next('Hallo to you too');
          });
      });

    this.panel.attach
      .subscribe(() => {
        if (this.bpService.isWeb) {
          this.panel.overlayRef.overlayElement.classList.remove('fullscreen');
        } else {
          this.panel.overlayRef.overlayElement.classList.add('fullscreen');
        }
      });
  }

  removeMessage(index: number) {
    this.messages.splice(index, 1);
  }
}
