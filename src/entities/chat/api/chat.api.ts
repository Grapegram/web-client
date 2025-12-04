import $api from '@/shared/api';
import { toApiError } from '@/shared/lib/utils';

import type {
  AddMemberRequest,
  AddMemberResponse,
  ArchiveChatRequest,
  ChangeChatTitleRequest,
  CreateChatRequest,
  CreateChatResponse,
  CreateDirectChatRequest,
  CreateDirectChatResponse,
  DeleteChatRequest,
  GetChatByIdResponse,
  GetChatsListResponse,
  UnarchiveChatRequest,
  UploadChatAvatarResponse
} from './chat.api.types';

const API_PREFIX = '/chats';

async function create(dto: CreateChatRequest) {
  try {
    const response = await $api.post<CreateChatResponse>(`${API_PREFIX}`, dto);
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

async function remove(dto: DeleteChatRequest) {
  try {
    const response = await $api.delete(`${API_PREFIX}`, { data: dto });
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

async function changeTitle(dto: ChangeChatTitleRequest) {
  try {
    const response = await $api.patch(`${API_PREFIX}/title`, dto);
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

async function archive(dto: ArchiveChatRequest) {
  try {
    const response = await $api.patch(`${API_PREFIX}/archive`, dto);
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

async function unarchive(dto: UnarchiveChatRequest) {
  try {
    const response = await $api.patch(`${API_PREFIX}/unarchive`, dto);
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

async function addMember(dto: AddMemberRequest) {
  try {
    const response = await $api.post<AddMemberResponse>(
      `${API_PREFIX}/members`,
      dto
    );
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

async function uploadAvatar(chatId: string, file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await $api.put<UploadChatAvatarResponse>(
      `${API_PREFIX}/${chatId}/avatar`,
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
    const response = await $api.get<GetChatsListResponse>(`${API_PREFIX}`);
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

async function getById(chatId: string) {
  try {
    const response = await $api.get<GetChatByIdResponse>(
      `${API_PREFIX}/${chatId}`
    );
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

async function createDirect(dto: CreateDirectChatRequest) {
  try {
    const response = await $api.post<CreateDirectChatResponse>(
      `${API_PREFIX}/direct`,
      dto
    );
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

export const ChatApi = {
  create,
  remove,
  createDirect,
  changeTitle,
  archive,
  unarchive,
  addMember,
  uploadAvatar,
  getAll,
  getById
};
