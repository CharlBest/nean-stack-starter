import * as http from 'http';
import * as WebSocket from 'ws';

export class WebSocketServer {
    private static socketServer: WebSocket.Server = null;

    static getSocketServer(server: http.Server = null): WebSocket.Server {
        if (!this.socketServer) {
            if (server) {
                return this.socketServer = new WebSocket.Server({ server });
            } else {
                return null;
            }
        } else {
            return this.socketServer;
        }
    }
}
