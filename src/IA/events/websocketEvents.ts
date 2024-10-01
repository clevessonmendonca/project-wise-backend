import WebSocket from 'ws';
import { handleChat } from './handlers/chat';

interface WebSocketMessage {
  type: string;
  data: any;
}

export const setupWebSocketEvents = (ws: WebSocket) => {
  console.log('Novo cliente conectado');

  ws.on('message', async (message: WebSocket.RawData) => {
    const messageString = message.toString();

    try {
      const { type, data }: WebSocketMessage = JSON.parse(messageString);

      switch (type) {
        case 'chat':
          await handleChat(ws, data);
          break;
        default:
          ws.send(JSON.stringify({
            type: 'error',
            data: 'Tipo de mensagem desconhecido',
          }));
      }
    } catch (parseError) {
      console.error('Erro ao analisar a mensagem:', parseError);
      ws.send(JSON.stringify({ type: 'error', data: 'Mensagem inválida' }));
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
};
