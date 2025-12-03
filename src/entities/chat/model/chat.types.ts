export interface Chat {
  id: string;
  type: ChatType;
  title: string;
  avatar?: string;
  members: ChatMember[];
}

export const enum ChatType {
  DIRECT = 'direct',
  GROUP = 'group'
}

export interface ChatMember {
  id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}
