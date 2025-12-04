// Base event structure
export interface BaseUserEventData {
  user_id: string;
}

// User presence events
export interface UserOnlineEvent extends BaseUserEventData {
  online_at: string;
}

export interface UserOfflineEvent extends BaseUserEventData {
  offline_at: string;
  last_seen?: string;
}

// User typing events
export interface UserTypingStartedEvent extends BaseUserEventData {
  chat_id: string;
  started_at: string;
}

export interface UserTypingStoppedEvent extends BaseUserEventData {
  chat_id: string;
  stopped_at: string;
}
