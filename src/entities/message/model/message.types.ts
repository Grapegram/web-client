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
