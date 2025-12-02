import { useQuery } from '@pinia/colada';

import { ChatApi } from '../api';

export const useGetChatsQuery = () => {
  return useQuery({
    key: () => ['chats'],
    query: async () => {
      const result = await ChatApi.getAll();
      return result;
    }
  });
};
