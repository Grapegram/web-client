import { useMutation, useQueryCache } from '@pinia/colada';

import { ChatApi } from '../api/chat.api';
import { useChatStore } from './chat.store';

export const useCreateDirectChatMutation = () => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: ChatApi.createDirect,
    onSuccess: data => {
      if (!data) return;

      const chatStore = useChatStore();
      chatStore.addChat({
        id: data.chat_id,
        title: data.title,
        members: []
      });

      // Invalidate chats query to refetch
      queryCache.invalidateQueries({ key: ['chats'] });
    }
  });
};
