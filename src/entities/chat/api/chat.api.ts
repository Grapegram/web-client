import $api from '@/shared/api';
import { toApiError } from '@/shared/lib/utils';

import type {
  AddMemberRequest,
  AddMemberResponse,
  ArchiveChatRequest,
  ChangeChatTitleRequest,
  CreateChatRequest,
  CreateChatResponse,
  LoadMessagesResponse,
  UnarchiveChatRequest
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

async function loadMessages(chatId: string, limit?: number, offset?: number) {
  try {
    const response = await $api.post<LoadMessagesResponse>(
      `${API_PREFIX}/${chatId}/messages`,
      null,
      {
        params: {
          limit,
          offset
        }
      }
    );

    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

export const ChatApi = {
  create,
  changeTitle,
  archive,
  unarchive,
  addMember,
  loadMessages
};
