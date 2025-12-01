import $api from '@/shared/api';
import { toApiError } from '@/shared/lib/utils';

import type {
  AddMessageReactionRequest,
  DeleteMessageRequest,
  EditMessageRequest,
  SendMessageRequest,
  SendMessageResponse
} from './message.api.types';

const API_PREFIX = '/messages';

async function send(dto: SendMessageRequest) {
  try {
    const response = await $api.post<SendMessageResponse>(`${API_PREFIX}`, dto);
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

export const MessageApi = { send, edit, remove, addReaction };
