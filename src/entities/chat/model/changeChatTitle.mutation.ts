import { useMutation } from '@pinia/colada';

import { ChatApi } from '../api/chat.api';
import { useChatStore } from './chat.store';

export const useChangeChatTitleMutation = () =>
  useMutation({
    mutation: ChatApi.changeTitle,
    onSuccess: (_, variables) => {
      const chatStore = useChatStore();
      chatStore.updateChat(variables.chat_id, {
        title: variables.new_title,
        updated_at: new Date().toISOString()
      });
    }
  });
