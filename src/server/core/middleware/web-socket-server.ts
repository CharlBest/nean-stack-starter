import { BaseWebSocketModel } from '@shared/models/web-socket/base-web-socket.model';
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

    // TODO: implement includeUserMakingRequest
    send(model: BaseWebSocketModel, includeUserMakingRequest = false): void {
        const wss = this.getSocketServer();
        const payload = JSON.stringify(model);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });
    }
}

export const webSocketServer = new WebSocketServer();
