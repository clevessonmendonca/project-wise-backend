import WebSocket from 'ws';
import { FastifyInstance } from 'fastify';
import { setupWebSocketEvents } from '../IA/events/websocketEvents';

export function setupWebSocket(app: FastifyInstance) {
  const wss = new WebSocket.Server({ noServer: true });

  app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      setupWebSocketEvents(ws);
    });
  });
}
