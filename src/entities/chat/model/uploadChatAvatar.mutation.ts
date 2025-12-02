import { useMutation } from '@pinia/colada';

import { ChatApi } from '../api';
import { useChatStore } from './chat.store';

export const useUploadChatAvatarMutation = (chatId: string) =>
  useMutation({
    mutation: (file: File) => ChatApi.uploadAvatar(chatId, file),
    onSuccess: data => {
      if (data) {
        const chatStore = useChatStore();
        chatStore.updateChatAvatar(chatId, data.avatar);
      }
    }
  });
