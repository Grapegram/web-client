import { useMutation } from '@pinia/colada';

import { useUserStore } from '@/entities/user';

import { AuthApi } from '../api/auth.api';

export const useVerifyEmailMutation = () =>
  useMutation({
    mutation: AuthApi.verifyEmail,
    onSuccess: () => {
      useUserStore().setVerified(true);
    }
  });
