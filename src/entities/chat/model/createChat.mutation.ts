import { useMutation } from '@pinia/colada';

import { ChatApi } from '../api/chat.api';
import { useChatStore } from './chat.store';

export const useCreateChatMutation = () =>
  useMutation({
    mutation: ChatApi.create,
    onSuccess: data => {
      if (!data) return;

      const chatStore = useChatStore();
      chatStore.addChat({
        id: data.chat_id,
        title: data.title,
        is_archived: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  });
