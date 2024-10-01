import type { WebSocket as WS } from 'ws';
import { handleOpenAIChat } from '../../openAI/services/openaiService';

const MESSAGE_INTERVAL = 2000; // 2 segundos
const userLastMessageTime = new Map<string, number>();

export const handleChat = async (ws: WS, data: any) => {
  const currentTime = Date.now();
  const lastMessageTime = userLastMessageTime.get('default') || 0;

  if (currentTime - lastMessageTime < MESSAGE_INTERVAL) {
    const errorMessage =
      'Você está enviando mensagens muito rapidamente. Tente novamente mais tarde.';
    ws.send(JSON.stringify({ type: 'error', data: errorMessage }));
    return;
  }

  userLastMessageTime.set('default', currentTime);

  try {
    const responseMessage = await handleOpenAIChat(data);
    console.log(responseMessage);
    ws.send(JSON.stringify({ type: 'response', data: responseMessage }));
  } catch (error: unknown) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'Ocorreu um erro inesperado';
    ws.send(JSON.stringify({ type: 'error', data: errorMessage }));
  }
};
