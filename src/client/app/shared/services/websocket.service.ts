import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/websocket';
import { SocketDataModel } from '../../../../shared/models/web-socket/socket-data.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService implements OnDestroy {

    public webSocketStream$: Subject<SocketDataModel> = new Subject<SocketDataModel>();
    private webSocketSubject: WebSocketSubject<SocketDataModel>;

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

    send(data: SocketDataModel) {
        this.webSocketSubject.next(data);
    }

    ngOnDestroy() {
        if (this.webSocketSubject) {
            this.webSocketSubject.unsubscribe();
        }
    }
}
