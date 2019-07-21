import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewSignUpWebSocketModel } from '../../../../shared/models/web-socket/new-sign-up-web-socket.model';
import { BreakpointService } from './breakpoint.service';
import { WebSocketService } from './websocket.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    messages: Array<string> = [];

    constructor(private webSocketService: WebSocketService,
        private snackBar: MatSnackBar,
        private bpService: BreakpointService) { }

    init() {
        // SnackBar
        this.webSocketService.newSignUp$
            .subscribe(data => {
                this.snackBar.dismiss();
                // Add messages to queue
                this.messages.push(data.message);

                // Show notification popup
                this.snackBar.open(data.message, 'Say hello back', {
                    duration: 5000,
                    verticalPosition: this.bpService.isDesktop ? 'top' : 'bottom',
                    horizontalPosition: this.bpService.isDesktop ? 'right' : 'center'
                }).onAction()
                    .subscribe(() => {
                        // Send message back
                        const model = new NewSignUpWebSocketModel();
                        model.message = 'Hello to you too';
                        this.webSocketService.send(model);
                    });
            });
    }

    removeMessage(index: number) {
        this.messages.splice(index, 1);
    }
}
