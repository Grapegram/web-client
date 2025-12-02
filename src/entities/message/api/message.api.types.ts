import type { Message } from '../model';

export interface SendMessageRequest {
  chat_id: string;
  text: string;
}

export interface SendMessageResponse {
  message_id: string;
  chat_id: string;
  sender_id: string;
  text: string;
}

export interface DeleteMessageRequest {
  message_id: string;
}

export interface EditMessageRequest {
  message_id: string;
  new_text: string;
}

export interface AddMessageReactionRequest {
  message_id: string;
  reaction: string;
}

export interface LoadMessagesResponse {
  messages: Message[];
  total_count: 0;
  limit: 0;
  offset: 0;
  has_more: true;
}
