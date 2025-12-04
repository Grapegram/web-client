import { useMutation } from '@pinia/colada';

import { MessageApi } from '../api/message.api';
import type { DeleteMessageRequest } from '../api/message.api.types';

export const useDeleteMessageMutation = () =>
  useMutation({
    mutation: (variables: DeleteMessageRequest) => MessageApi.remove(variables),
    onSuccess: (_, variables) => {
      // const messageStore = useMessageStore();
      // // Find the message to get chat_id
      // const allMessages = messageStore.allMessages;
      // const message = allMessages.find(m => m.id === variables.message_id);
      // if (message) {
      //   messageStore.removeMessage(message.chat_id, variables.message_id);
      // }
    }
  });
