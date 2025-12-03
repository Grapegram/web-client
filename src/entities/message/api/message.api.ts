import $api from '@/shared/api';
import { toApiError } from '@/shared/lib/utils';

import type {
  AddMessageReactionRequest,
  DeleteMessageRequest,
  EditMessageRequest,
  LoadMessagesResponse,
  SendMessageRequest,
  SendMessageResponse
} from './message.api.types';

const API_PREFIX = '/messages';

async function send(dto: SendMessageRequest) {
  try {
    const formData = new FormData();
    formData.append('chat_id', dto.chat_id);

    if (dto.text) {
      formData.append('text', dto.text);
    }

    if (dto.images && dto.images.length > 0) {
      dto.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await $api.post<SendMessageResponse>(
      `${API_PREFIX}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

async function edit(dto: EditMessageRequest) {
  try {
    const response = await $api.patch(`${API_PREFIX}`, dto);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

async function remove(dto: DeleteMessageRequest) {
  try {
    const response = await $api.delete(`${API_PREFIX}`, { data: dto });
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

async function addReaction(dto: AddMessageReactionRequest) {
  try {
    const response = await $api.post(`${API_PREFIX}/reactions`, dto);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

async function loadMessages(
  chatId: string,
  limit?: number,
  from_message_id?: string
) {
  try {
    const response = await $api.get<LoadMessagesResponse>(
      `chats/${chatId}/messages`,
      {
        params: {
          limit,
          from_message_id
        }
      }
    );

    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

export const MessageApi = { send, edit, remove, addReaction, loadMessages };
