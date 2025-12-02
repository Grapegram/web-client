import { useQuery } from '@pinia/colada';

import { MessageApi } from '../api';

export const useLoadMessagesQuery = (
  chatId: string,
  options?: { limit?: number; offset?: number }
) => {
  const query = useQuery({
    key: () => [
      'messages',
      chatId,
      options?.limit ?? null,
      options?.offset ?? null
    ],
    query: async () => {
      const result = await MessageApi.loadMessages(
        chatId,
        options?.limit,
        options?.offset
      );
      return result;
    }
  });

  return query;
};
