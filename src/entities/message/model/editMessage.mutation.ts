import { useMutation } from '@pinia/colada';

import { MessageApi } from '../api/message.api';
import { useMessageStore } from './message.store';

export const useEditMessageMutation = () =>
  useMutation({
    mutation: MessageApi.edit,
    onSuccess: (_, variables) => {
      const messageStore = useMessageStore();
      // We need to find the chat_id for this message
      // This could be improved by passing chat_id in variables or storing it differently
      const allMessages = messageStore.allMessages;
      const message = allMessages.find(m => m.id === variables.message_id);

      if (message) {
        messageStore.updateMessage(message.chat_id, variables.message_id, {
          text: variables.new_text,
          updated_at: new Date().toISOString()
        });
      }
    }
  });
