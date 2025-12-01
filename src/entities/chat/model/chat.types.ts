export interface Chat {
  id: string;
  title: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMember {
  id: string;
  user_id: string;
  chat_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface MessageGroup {
  id: string;
  sender_id: string;
  messages: Message[];
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  text: string;
  is_deleted: boolean;
  reactions: Record<string, number>;
  read_by: string[];
  created_at: string;
  updated_at: string;
}
