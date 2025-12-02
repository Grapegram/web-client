import { useMutation } from '@pinia/colada';

import { UserApi } from '../api/user.api';
import { useUserStore } from './user.store';

export const useUploadAvatarMutation = () =>
  useMutation({
    mutation: UserApi.uploadAvatar,
    onSuccess: data => {
      if (data) {
        const userStore = useUserStore();
        userStore.updateAvatar(data.avatar);
      }
    }
  });
