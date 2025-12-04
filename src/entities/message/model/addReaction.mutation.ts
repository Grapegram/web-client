import { useMutation } from '@pinia/colada';

import { MessageApi } from '../api/message.api';
import { useMessageStore } from './message.store';

export const useAddReactionMutation = () =>
  useMutation({
    mutation: MessageApi.addReaction,
    onSuccess: (_, variables) => {
      const messageStore = useMessageStore();
      // Find the message to get chat_id
      const allMessages = messageStore.allMessages;
      const message = allMessages.find(m => m.id === variables.message_id);

      // if (message) {
      //   messageStore.addReaction(
      //     message.chat_id,
      //     variables.message_id,
      //     variables.reaction
      //   );
      // }
    }
  });
