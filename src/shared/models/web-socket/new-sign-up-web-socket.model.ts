import { BaseWebSocketModel } from './base-web-socket.model';
import { WebSocketType } from './web-socket.enum';

export class NewSignUpWebSocketModel extends BaseWebSocketModel {
    message: string;

    constructor() {
        super();
        this.type = WebSocketType.NEW_SIGN_UP;
    }
}
