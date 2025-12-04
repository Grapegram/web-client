// Base event structure
export interface BaseEventData {
  chat_id: string;
}

// Chat events
export interface ChatCreatedEvent extends BaseEventData {
  title: string;
  chat_type: 'private' | 'group' | 'channel';
  created_by: string;
  created_at: string;
}

export interface ChatTitleChangedEvent extends BaseEventData {
  old_title: string;
  new_title: string;
  changed_by: string;
  changed_at: string;
}

export interface MemberAddedEvent extends BaseEventData {
  member_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  added_by: string;
  added_at: string;
}

export interface MemberRemovedEvent extends BaseEventData {
  member_id: string;
  user_id: string;
  removed_by: string;
  removed_at: string;
}

export interface MemberRoleChangedEvent extends BaseEventData {
  member_id: string;
  old_role: 'owner' | 'admin' | 'member';
  new_role: 'owner' | 'admin' | 'member';
  changed_by: string;
  changed_at: string;
}

export interface ChatAvatarChangedEvent extends BaseEventData {
  old_avatar: string | null;
  new_avatar: string | null;
  changed_by: string;
  changed_at: string;
}

export interface ChatArchivedEvent extends BaseEventData {
  archived_by: string;
  archived_at: string;
}

export interface ChatUnarchivedEvent extends BaseEventData {
  unarchived_by: string;
  unarchived_at: string;
}

export interface ChatDeletedEvent extends BaseEventData {
  deleted_by: string;
  deleted_at: string;
}

export interface ChatAddedEvent {
  chat_id: string;
}

// Message events
export interface MessageSentEvent extends BaseEventData {
  message_id: string;
  sender_id: string;
  text: string;
  images: string[];
  sent_at: string;
}

export interface MessageEditedEvent extends BaseEventData {
  message_id: string;
  old_text: string;
  new_text: string;
  edited_by: string;
  edited_at: string;
}

export interface MessageDeletedEvent extends BaseEventData {
  message_id: string;
  deleted_by: string;
  deleted_at: string;
}

export interface MessageReactionAddedEvent extends BaseEventData {
  message_id: string;
  user_id: string;
  reaction: string;
  added_at: string;
}

export interface MessageReactionRemovedEvent extends BaseEventData {
  message_id: string;
  user_id: string;
  reaction: string;
  removed_at: string;
}

export interface MessageReadEvent extends BaseEventData {
  message_id: string;
  user_id: string;
  read_at: string;
}
