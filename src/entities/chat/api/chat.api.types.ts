import type { Chat } from '../model';

export interface CreateChatRequest {
  title: string;
}

export interface CreateChatResponse {
  chat_id: string;
  title: string;
}

export interface ChangeChatTitleRequest {
  chat_id: string;
  new_title: string;
}

export interface ArchiveChatRequest {
  chat_id: string;
}

export interface UnarchiveChatRequest {
  chat_id: string;
}

export interface AddMemberRequest {
  chat_id: string;
  user_id: string;
  role: 'member';
}

export interface AddMemberResponse {
  member_id: string;
  user_id: string;
  chat_id: string;
  role: string;
}

export interface UploadChatAvatarResponse {
  avatar: string;
}

export interface GetChatsListResponse {
  chats: Chat[];
}
