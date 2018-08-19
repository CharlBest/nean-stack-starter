import * as http from 'http';
import * as webSocket from 'ws';

export class WebSocketServer {
    private static socketServer: webSocket.Server = null;

    static getSocketServer(server: http.Server = null) {
        if (!this.socketServer) {
            if (server) {
                return this.socketServer = new webSocket.Server({ server });
            } else {
                return null;
            }
        } else {
            return this.socketServer;
        }
    }
}
