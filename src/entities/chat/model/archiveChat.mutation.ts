import { useMutation } from '@pinia/colada';

import { ChatApi } from '../api/chat.api';
import { useChatStore } from './chat.store';

export const useArchiveChatMutation = () =>
  useMutation({
    mutation: ChatApi.archive,
    onSuccess: (_, variables) => {
      const chatStore = useChatStore();
      chatStore.updateChat(variables.chat_id, {
        is_archived: true,
        updated_at: new Date().toISOString()
      });
    }
  });

export const useUnarchiveChatMutation = () =>
  useMutation({
    mutation: ChatApi.unarchive,
    onSuccess: (_, variables) => {
      const chatStore = useChatStore();
      chatStore.updateChat(variables.chat_id, {
        is_archived: false,
        updated_at: new Date().toISOString()
      });
    }
  });
