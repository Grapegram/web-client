import $api from '@/shared/api';
import { toApiError } from '@/shared/lib/utils';

import type {
  GetMeResponse,
  GetUsersListResponse,
  UploadAvatarResponse
} from './user.api.types';

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

async function getAll() {
  try {
    const response = await $api.get<GetUsersListResponse>(
      `${API_PREFIX}/users`
    );
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

async function getMe() {
  try {
    const response = await $api.get<GetMeResponse>(`${API_PREFIX}/me`);
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

export const UserApi = {
  uploadAvatar,
  getAll,
  getMe
};
