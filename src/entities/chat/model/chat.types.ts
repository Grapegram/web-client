export interface Chat {
  id: string;
  title: string;
  avatar?: string;
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
