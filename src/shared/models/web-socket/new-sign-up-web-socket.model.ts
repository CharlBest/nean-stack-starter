import { TranslateKey } from '../../translate/translate-term.interface';
import { BaseWebSocketModel } from './base-web-socket.model';
import { WebSocketType } from './web-socket.enum';

export class NewSignUpWebSocketModel extends BaseWebSocketModel {
    message: TranslateKey;

    constructor() {
        super();
        this.type = WebSocketType.NEW_SIGN_UP;
    }
}
