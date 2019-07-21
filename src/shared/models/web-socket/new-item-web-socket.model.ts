import { BaseWebSocketModel } from './base-web-socket.model';
import { WebSocketType } from './web-socket.enum';

export class NewItemWebSocketModel extends BaseWebSocketModel {
    constructor() {
        super();
        this.type = WebSocketType.NEW_ITEM;
    }
}
