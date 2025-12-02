export interface Chat {
  id: string;
  title: string;
  avatar?: string;
  members: ChatMember[];
}

export interface ChatMember {
  id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}
