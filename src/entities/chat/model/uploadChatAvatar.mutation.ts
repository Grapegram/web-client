import { useMutation } from '@pinia/colada';

import { ChatApi } from '../api';
import { useChatStore } from './chat.store';

export const useUploadChatAvatarMutation = () =>
  useMutation({
    mutation: ({ chatId, file }: { chatId: string; file: File }) =>
      ChatApi.uploadAvatar(chatId, file),
    onSuccess: (data, { chatId }) => {
      if (data) {
        const chatStore = useChatStore();
        chatStore.updateChatAvatar(chatId, data.avatar);
      }
    }
  });
