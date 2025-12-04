import { useMutation } from '@pinia/colada';

import { ChatApi } from '../api/chat.api';
import { useChatStore } from './chat.store';

export const useCreateChatMutation = () => {
  const chatStore = useChatStore();

  return useMutation({
    mutation: ChatApi.create,
    onSuccess: data => {}
  });
};
