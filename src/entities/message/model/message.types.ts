export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  text: string | null;
  images: string[];
  sent_at: string;
  edited_at: string | null;
  reactions: Record<string, string[]>;
  read_by: string[];
}

export interface MessageGroup {
  id: string;
  sender_id: string;
  messages: Message[];
}
