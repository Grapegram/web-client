import { useQuery } from '@pinia/colada';

import { UserApi } from '../api';

export const useGetUsersQuery = () => {
  return useQuery({
    key: () => ['users'],
    query: async () => {
      const result = await UserApi.getAll();
      return result;
    }
  });
};
