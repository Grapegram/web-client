import { useQuery } from '@pinia/colada';

import { UserApi } from '../api/user.api';

export function useGetMeQuery() {
  return useQuery({
    key: ['user', 'me'],
    query: () => UserApi.getMe(),
    staleTime: 300000 // 5 minutes
  });
}
