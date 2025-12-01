import type { ChatSocket } from './api.types';

const SOCKET_URL = `${import.meta.env.VITE_SOCKET_URL}/ws/chat`;
const chatSockets = new Map<string, ChatSocket>();

function connectToChatSocket(chatId: string, authToken: string): WebSocket {
  if (chatSockets.has(chatId)) return chatSockets.get(chatId)!.ws;

  const ws = new WebSocket(`${SOCKET_URL}/${chatId}`);

  ws.onopen = () => {
    console.log(`WS connected to chat ${chatId}`);

    ws.send(
      JSON.stringify({
        action: 'authorize',
        token: authToken
      })
    );
  };

  chatSockets.set(chatId, {
    ws,
    chatId,
    authorized: false
  });

  return ws;
}

function disconnectFromChat(chatId: string) {
  const socket = chatSockets.get(chatId);
  if (!socket) return;

  socket.ws.close();
  chatSockets.delete(chatId);
}

function disconnectAllChats() {
  for (const { ws } of chatSockets.values()) {
    ws.close();
  }
  chatSockets.clear();
}

function getChatSocket(chatId: string): WebSocket | null {
  return chatSockets.get(chatId)?.ws ?? null;
}

export const $chatSocketApi = {
  connectToChatSocket,
  disconnectFromChat,
  disconnectAllChats,
  getChatSocket
};
