import { type MaybeRefOrGetter, toValue } from 'vue';

import { useQuery } from '@pinia/colada';

import { MessageApi } from '../api';

export const useLoadMessagesQuery = (
  chatId: MaybeRefOrGetter<string>,
  options?: MaybeRefOrGetter<{ limit?: number; from_message_id?: string }>
) => {
  const query = useQuery({
    key: () => {
      const id = toValue(chatId);
      const opts = toValue(options);
      return [
        'messages',
        id,
        opts?.limit ?? null,
        opts?.from_message_id ?? null
      ];
    },
    query: async () => {
      const id = toValue(chatId);
      const opts = toValue(options);

      if (!id) return { messages: [], limit: 50, has_more: false };

      const result = await MessageApi.loadMessages(
        id,
        opts?.limit,
        opts?.from_message_id
      );
      return result || { messages: [], limit: 50, has_more: false };
    },
    enabled: () => {
      const id = toValue(chatId);
      return !!id && id.length > 0;
    }
  });

  return query;
};
