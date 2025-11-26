import { DateTime } from 'luxon';

export type Message = {
  id: string;
  text: string | null;
  images?: string[];
  sender: string;
  createdAt: DateTime;
};

export type Chat = {
  id: string;
  title: string;
  members: string[]; // UserIDs
};

export type MessageGroup = {
  id: string;
  sender: string;
  messages: Message[];
};
