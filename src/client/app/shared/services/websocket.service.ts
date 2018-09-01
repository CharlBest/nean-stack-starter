import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/websocket';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService implements OnDestroy {

    public webSocketStream$: Subject<SocketData> = new Subject<SocketData>();
    private webSocketSubject: WebSocketSubject<SocketData>;

    constructor() {
        this.init();
    }

    init() {
        this.webSocketSubject = new WebSocketSubject({
            url: environment.webSocketUrlEndpoint
        });

        this.webSocketSubject.subscribe(
            data => {
                this.webSocketStream$.next(data);
            }, err => {
                console.error(err);
            }, () => {
                console.warn('Socket completed');
            }
        );
    }

    send(data: SocketData) {
        this.webSocketSubject.next(data);
    }

    ngOnDestroy() {
        if (this.webSocketSubject) {
            this.webSocketSubject.unsubscribe();
        }
    }
}

class SocketData {
    message: string;
}
