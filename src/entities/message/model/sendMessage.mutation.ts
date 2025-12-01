import { useMutation } from '@pinia/colada';

import { MessageApi } from '../api/message.api';
import { useMessageStore } from './message.store';

export const useSendMessageMutation = () =>
  useMutation({
    mutation: MessageApi.send,
    onSuccess: data => {
      if (!data) return;

      const messageStore = useMessageStore();
      messageStore.addMessage({
        id: data.message_id,
        chat_id: data.chat_id,
        sender_id: data.sender_id,
        text: data.text,
        is_deleted: false,
        reactions: {},
        read_by: [data.sender_id],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  });
