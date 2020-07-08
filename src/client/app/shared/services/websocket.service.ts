import { Injectable, OnDestroy } from '@angular/core';
import { BaseWebSocketModel } from '@shared/models/web-socket/base-web-socket.model';
import { NewItemWebSocketModel } from '@shared/models/web-socket/new-item-web-socket.model';
import { NewSignUpWebSocketModel } from '@shared/models/web-socket/new-sign-up-web-socket.model';
import { WebRTCSignalWebSocketModel } from '@shared/models/web-socket/web-rtc-signal-web-socket.model';
import { WebSocketType } from '@shared/models/web-socket/web-socket.enum';
import { Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService implements OnDestroy {

    private webSocketSubject: WebSocketSubject<BaseWebSocketModel>;
    newSignUp$: Subject<NewSignUpWebSocketModel> = new Subject<NewSignUpWebSocketModel>();
    newItem$: Subject<NewItemWebSocketModel> = new Subject<NewItemWebSocketModel>();
    webRTCSignal$: Subject<WebRTCSignalWebSocketModel> = new Subject<WebRTCSignalWebSocketModel>();

    constructor() {
        this.init();
    }

    init(): void {
        this.webSocketSubject = new WebSocketSubject({
            url: environment.webSocketEndpoint
        });

        this.webSocketSubject.subscribe(
            data => {
                switch (data.type) {
                    case WebSocketType.NEW_SIGN_UP:
                        this.newSignUp$.next(data as NewSignUpWebSocketModel);
                        break;

                    case WebSocketType.NEW_ITEM:
                        this.newItem$.next(data as NewSignUpWebSocketModel);
                        break;

                    case WebSocketType.WEB_RTC_SIGNAL:
                        this.webRTCSignal$.next(data as WebRTCSignalWebSocketModel);
                        break;

                    default:
                        break;
                }
            }, err => {
                console.error(err);
            }, () => {
                console.warn('Socket completed');
            }
        );
    }

    send(data: BaseWebSocketModel): void {
        this.webSocketSubject.next(data);
    }

    ngOnDestroy(): void {
        if (this.webSocketSubject) {
            this.webSocketSubject.unsubscribe();
        }
    }
}
