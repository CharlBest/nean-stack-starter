import { Injectable, OnDestroy } from '@angular/core';
import { NewItemWebSocketModel } from '@shared/models/web-socket/new-item-web-socket.model';
import { NewSignUpWebSocketModel } from '@shared/models/web-socket/new-sign-up-web-socket.model';
import { WebSocketType } from '@shared/models/web-socket/web-socket.enum';
import { Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService implements OnDestroy {

    private webSocketSubject: WebSocketSubject<NewSignUpWebSocketModel | NewItemWebSocketModel>;
    newSignUp$: Subject<NewSignUpWebSocketModel> = new Subject<NewSignUpWebSocketModel>();
    newItem$: Subject<NewItemWebSocketModel> = new Subject<NewItemWebSocketModel>();

    constructor() {
        this.init();
    }

    init() {
        this.webSocketSubject = new WebSocketSubject({
            url: `ws${environment.production ? 's' : ''}://${environment.domain}/api/`
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

    send(data: NewSignUpWebSocketModel) {
        this.webSocketSubject.next(data);
    }

    ngOnDestroy() {
        if (this.webSocketSubject) {
            this.webSocketSubject.unsubscribe();
        }
    }
}
