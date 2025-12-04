import { useQuery } from '@pinia/colada';

import { ChatApi } from '../api';

export const useGetChatByIdQuery = (chatId: string) => {
  return useQuery({
    key: () => ['chats', chatId],
    query: async () => {
      const result = await ChatApi.getById(chatId);
      return result;
    }
  });
};
