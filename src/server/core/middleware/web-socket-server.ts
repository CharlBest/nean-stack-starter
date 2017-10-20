import * as webSocket from 'ws';
import * as http from 'http';

export class WebSocketServer {
    private static socketServer: webSocket.Server = null;

    static getSocketServer(server: http.Server = null) {
        if (this.socketServer === null) {
            if (server !== null) {
                return this.socketServer = new webSocket.Server({ server });
            } else {
                return null;
            }
        } else {
            return this.socketServer;
        }
    }
}
