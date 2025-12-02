import { useMutation } from '@pinia/colada';

import { AuthApi } from '../api/auth.api';
import { useAuthStore } from './auth.store';

export const useLoginMutation = () =>
  useMutation({
    mutation: AuthApi.login,
    onSuccess: data => {
      useAuthStore().login(data.access_token);
    }
  });
