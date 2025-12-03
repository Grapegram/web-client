import { useMutation } from '@pinia/colada';

import { ChatApi } from '../api';
import { useChatStore } from './chat.store';

export const useDeleteChatMutation = () =>
  useMutation({
    mutation: ChatApi.remove,
    onSuccess: (_, variables) => {
      const chatStore = useChatStore();
      chatStore.removeChat(variables.chat_id);
    }
  });
