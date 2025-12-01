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
