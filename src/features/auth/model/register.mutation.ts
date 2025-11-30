import { useMutation } from '@pinia/colada';

import { AuthApi } from '../api/auth.api';

export const useRegisterMutation = () =>
  useMutation({
    mutation: AuthApi.register
  });
