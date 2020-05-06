import SimplePeer from 'simple-peer';
import { BaseWebSocketModel } from './base-web-socket.model';
import { WebSocketType } from './web-socket.enum';

export class WebRTCSignalWebSocketModel extends BaseWebSocketModel {
    data: SimplePeer.SignalData;

    constructor() {
        super();
        this.type = WebSocketType.WEB_RTC_SIGNAL;
    }
}
