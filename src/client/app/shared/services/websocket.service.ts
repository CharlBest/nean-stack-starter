import { Injectable, OnDestroy } from '@angular/core';
import { SocketDataModel } from '@shared/models/web-socket/socket-data.model';
import { Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService implements OnDestroy {

    private webSocketSubject: WebSocketSubject<SocketDataModel>;
    webSocketStream$: Subject<SocketDataModel> = new Subject<SocketDataModel>();

    constructor() {
        this.init();
    }

    init() {
        this.webSocketSubject = new WebSocketSubject({
            url: `ws${environment.production ? 's' : ''}://${environment.domain}/api/`
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
