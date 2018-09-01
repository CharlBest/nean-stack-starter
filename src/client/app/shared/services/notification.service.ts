import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { BreakpointService } from './breakpoint.service';
import { WebSocketService } from './websocket.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    messages = [];

    constructor(private webSocketService: WebSocketService,
        private snackBar: MatSnackBar,
        private bpService: BreakpointService) { }

    init() {
        // SnackBar
        this.webSocketService.messages
            .subscribe((data) => {
                // Add messages to queue
                this.messages.push(data);

                // Show notification popup
                this.snackBar.open(data, 'Say hello back', {
                    duration: 5000,
                    verticalPosition: this.bpService.isWeb ? 'top' : 'bottom',
                    horizontalPosition: this.bpService.isWeb ? 'right' : 'center'
                }).onAction()
                    .subscribe(() => {
                        // Send message back
                        this.webSocketService.messages.next('Hello to you too');
                    });
            });
    }

    removeMessage(index: number) {
        this.messages.splice(index, 1);
    }
}
