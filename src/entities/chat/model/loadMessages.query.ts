import { useQuery } from '@pinia/colada';

import { ChatApi } from '../api/chat.api';

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
      const result = await ChatApi.loadMessages(
        chatId,
        options?.limit,
        options?.offset
      );
      return result;
    }
  });

  return query;
};
