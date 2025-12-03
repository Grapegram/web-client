import { useMutation, useQueryCache } from '@pinia/colada';

import { MessageApi } from '../api/message.api';
import { useMessageStore } from './message.store';

export const useSendMessageMutation = () => {
  const queryCache = useQueryCache();
  const messageStore = useMessageStore();

  return useMutation({
    mutation: MessageApi.send,
    onSuccess: (data, variables) => {
      messageStore.addMessage({
        id: data.message_id,
        chat_id: variables.chat_id,
        sender_id: data.sender_id,
        text: data.text || null,
        images: [],
        sent_at: new Date().toISOString(),
        edited_at: null,
        reactions: {},
        read_by: [data.sender_id]
      });

      queryCache.invalidateQueries({
        key: ['messages', variables.chat_id]
      });

      queryCache.invalidateQueries({
        key: ['messages', variables.chat_id, 'last']
      });
    }
  });
};
