import * as http from 'http';
import * as WebSocket from 'ws';
import { logger } from '../utils/logger';

class WebSocketServer {
    private socketServer: WebSocket.Server;

    init(server: http.Server): WebSocket.Server {
        return this.socketServer = new WebSocket.Server({ server });
    }

    getSocketServer(): WebSocket.Server {
        if (this.socketServer) {
            return this.socketServer;
        } else {
            const error = `WebSocket Server is null or undefined`;
            logger.error(error);
            throw new Error(error);
        }
    }
}

export const webSocketServer = new WebSocketServer();
