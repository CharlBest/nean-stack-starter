import * as http from 'http';
import * as WebSocket from 'ws';

class WebSocketServer {
    private socketServer: WebSocket.Server;

    init(server: http.Server): WebSocket.Server {
        return this.socketServer = new WebSocket.Server({ server });
    }

    getSocketServer(): WebSocket.Server {
        if (this.socketServer) {
            return this.socketServer;
        } else {
            throw new Error(`WebSocket Server is null or undefined`);
        }
    }
}

export const webSocketServer = new WebSocketServer();
