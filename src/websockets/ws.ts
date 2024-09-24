import WebSocket from 'ws';
import { FastifyInstance } from 'fastify';

export function setupWebSocket(app: FastifyInstance) {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on('connection', (ws) => {
    console.log('Novo cliente conectado');

    ws.on('message', (message) => {
      const { type, data } = JSON.parse(message as any);
      console.log({ type, data });
    });

    ws.on('close', () => {
      console.log('Cliente desconectado');
    });
  });

  app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
}
