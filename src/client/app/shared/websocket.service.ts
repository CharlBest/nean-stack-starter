import { Injectable } from '@angular/core';
import { Observable, Subject, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class WebSocketService {

    public messages: Subject<string>;

    constructor() {
        this.messages = <Subject<string>>this.connect(this.messages)
            .pipe(
                map((response): string => response.data)
            );
    }

    public connect(subject: Subject<any>): Subject<MessageEvent> {
        if (!subject) {
            subject = this.create<any>();
            console.log('socket connected');
        }
        return subject;
    }

    private create<T>(): Subject<T> {
        const ws = new WebSocket(environment.webSocketUrlEndpoint);

        const observable = Observable.create((obs: Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            return ws.close.bind(ws);
        });

        //TODO: check data type for sending socket data
        const observer = {
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(data);
                }
            }
        };
        return Subject.create(observer, observable);
    }
}
