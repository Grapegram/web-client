import { useMutation } from '@pinia/colada';

import { ChatApi } from '../api/chat.api';
import { useChatStore } from './chat.store';

export const useFetchChatByIdMutation = () => {
  const chatStore = useChatStore();

  return useMutation({
    mutation: (chatId: string) => ChatApi.getById(chatId),
    onSuccess: data => {
      if (!data?.chat) return;

      // Add or update the chat in the store
      chatStore.addChat(data.chat);
    },
    onError: error => {
      console.error('Failed to fetch chat by ID:', error);
    }
  });
};
