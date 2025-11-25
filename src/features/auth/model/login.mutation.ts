import { useMutation } from '@pinia/colada';

import { useUserStore } from '@/entities/user';

import { AuthApi } from '../api/auth.api';

export const useLoginMutation = () =>
  useMutation({
    mutation: AuthApi.login,
    onSuccess: data => {
      useUserStore().setToken(data.access_token);
    }
  });
