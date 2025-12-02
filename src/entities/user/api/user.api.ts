import $api from '@/shared/api';
import { toApiError } from '@/shared/lib/utils';

import type { UploadAvatarResponse } from './user.api.types';

const API_PREFIX = '/users';

async function uploadAvatar(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await $api.put<UploadAvatarResponse>(
      `${API_PREFIX}/me/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

export const UserApi = {
  uploadAvatar
};
