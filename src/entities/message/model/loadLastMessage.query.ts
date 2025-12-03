import { type MaybeRefOrGetter, toValue } from 'vue';

import { useQuery } from '@pinia/colada';

import { MessageApi } from '../api';

export const useLoadLastMessageQuery = (chatId: MaybeRefOrGetter<string>) => {
  const query = useQuery({
    key: () => {
      const id = toValue(chatId);
      return ['messages', id, 'last'];
    },
    query: async () => {
      const id = toValue(chatId);

      if (!id) return null;

      const result = await MessageApi.loadMessages(id, 1);

      if (!result || !result.messages || result.messages.length === 0) {
        return null;
      }

      return result.messages[0];
    },
    enabled: () => {
      const id = toValue(chatId);
      return !!id && id.length > 0;
    },
    staleTime: 30000 // Cache for 30 seconds
  });

  return query;
};
