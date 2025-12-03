// WebSocket types based on backend API documentation

// Base event structure
export interface BaseEventData {
  event_id: string;
  event_name: string;
  occurred_at: string;
  chat_id: string;
}

// Chat events
export interface ChatCreatedEvent extends BaseEventData {
  event_name: 'ChatCreated';
  title: string;
  chat_type: 'private' | 'group' | 'channel';
  created_by: string;
  created_at: string;
}

export interface ChatTitleChangedEvent extends BaseEventData {
  event_name: 'ChatTitleChanged';
  old_title: string;
  new_title: string;
  changed_by: string;
  changed_at: string;
}

export interface MemberAddedEvent extends BaseEventData {
  event_name: 'MemberAdded';
  member_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  added_by: string;
  added_at: string;
}

export interface MemberRemovedEvent extends BaseEventData {
  event_name: 'MemberRemoved';
  member_id: string;
  user_id: string;
  removed_by: string;
  removed_at: string;
}

export interface MemberRoleChangedEvent extends BaseEventData {
  event_name: 'MemberRoleChanged';
  member_id: string;
  old_role: 'owner' | 'admin' | 'member';
  new_role: 'owner' | 'admin' | 'member';
  changed_by: string;
  changed_at: string;
}

export interface ChatAvatarChangedEvent extends BaseEventData {
  event_name: 'ChatAvatarChanged';
  old_avatar: string | null;
  new_avatar: string | null;
  changed_by: string;
  changed_at: string;
}

export interface ChatArchivedEvent extends BaseEventData {
  event_name: 'ChatArchived';
  archived_by: string;
  archived_at: string;
}

export interface ChatUnarchivedEvent extends BaseEventData {
  event_name: 'ChatUnarchived';
  unarchived_by: string;
  unarchived_at: string;
}

export interface ChatDeletedEvent extends BaseEventData {
  event_name: 'ChatDeleted';
  deleted_by: string;
  deleted_at: string;
}

// Message events
export interface MessageSentEvent extends BaseEventData {
  event_name: 'MessageSent';
  message_id: string;
  sender_id: string;
  text: string;
  images: string[];
  sent_at: string;
}

export interface MessageEditedEvent extends BaseEventData {
  event_name: 'MessageEdited';
  message_id: string;
  old_text: string;
  new_text: string;
  edited_by: string;
  edited_at: string;
}

export interface MessageDeletedEvent extends BaseEventData {
  event_name: 'MessageDeleted';
  message_id: string;
  deleted_by: string;
  deleted_at: string;
}

export interface MessageReactionAddedEvent extends BaseEventData {
  event_name: 'MessageReactionAdded';
  message_id: string;
  user_id: string;
  reaction: string;
  added_at: string;
}

export interface MessageReactionRemovedEvent extends BaseEventData {
  event_name: 'MessageReactionRemoved';
  message_id: string;
  user_id: string;
  reaction: string;
  removed_at: string;
}

export interface MessageReadEvent extends BaseEventData {
  event_name: 'MessageRead';
  message_id: string;
  user_id: string;
  read_at: string;
}

// Union type for all events
export type ChatEvent =
  | ChatCreatedEvent
  | ChatTitleChangedEvent
  | MemberAddedEvent
  | MemberRemovedEvent
  | MemberRoleChangedEvent
  | ChatAvatarChangedEvent
  | ChatArchivedEvent
  | ChatUnarchivedEvent
  | ChatDeletedEvent
  | MessageSentEvent
  | MessageEditedEvent
  | MessageDeletedEvent
  | MessageReactionAddedEvent
  | MessageReactionRemovedEvent
  | MessageReadEvent;

// WebSocket message structure
export interface WebSocketMessage {
  channel: string;
  data: ChatEvent;
}

// Authorization messages
export interface AuthMessage {
  action: 'authorize';
  token: string;
}

export interface AuthResponse {
  status: 'authorized' | 'unauthorized';
}

// Type guards
export function isAuthResponse(message: unknown): message is AuthResponse {
  return (
    typeof message === 'object' &&
    message !== null &&
    'status' in message &&
    (message.status === 'authorized' || message.status === 'unauthorized')
  );
}

export function isWebSocketMessage(
  message: unknown
): message is WebSocketMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'channel' in message &&
    'data' in message &&
    typeof (message as WebSocketMessage).data === 'object' &&
    'event_name' in (message as WebSocketMessage).data
  );
}
