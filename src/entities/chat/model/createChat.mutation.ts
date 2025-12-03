import { useMutation } from '@pinia/colada';

import { ChatApi } from '../api/chat.api';
import { useChatStore } from './chat.store';
import { ChatType } from './chat.types';

export const useCreateChatMutation = () => {
  const chatStore = useChatStore();

  return useMutation({
    mutation: ChatApi.create,
    onSuccess: data => {
      if (!data) return;

      const newChat = {
        id: data.chat_id,
        title: data.title,
        type: ChatType.GROUP,
        members: [],
        avatar: undefined
      };

      chatStore.addChat(newChat);
    }
  });
};
