import { defineStore } from 'pinia';
import type { Message } from './messages';
import type { UserId } from './user';

export type ChatId = string;

export const enum ChatType {
  GROUP = 'group',
  DIRECT = 'direct'
}

export type ChatData = Chat & {
  messages: Message[];
};

export type Chat = {
  id: ChatId;
  type: ChatType;
  name: string;
  avatarURL: string | null;
  partisipents: UserId[];
};

type ChatStore = {
  chats: Chat[];
  currentChatId: ChatId | null;
  pinnedChatsIds: Set<ChatId>;
};

export const useChatStore = defineStore('chat', {
  state: (): ChatStore => ({
    chats: mockChats,
    currentChatId: '1',
    pinnedChatsIds: new Set(['47', '3'])
  }),

  getters: {
    currentChat(state): Chat | null {
      return state.chats.find(c => c.id === state.currentChatId) || null;
    },

    getChatById(state) {
      return (id: ChatId): Chat | null =>
        state.chats.find(c => c.id === id) || null;
    },

    pinnedChats(state): Chat[] {
      return Array.from(state.pinnedChatsIds).flatMap(id => {
        const chat = state.chats.find(c => c.id === id);
        return chat ? [chat] : [];
      });
    },

    unpinnedChats(state): Chat[] {
      return state.chats.filter(c => !state.pinnedChatsIds.has(c.id));
    }
  },

  actions: {
    setCurrentChat(id: ChatId | null) {
      this.currentChatId = id;
    },

    setChats(chats: Chat[]) {
      this.chats = chats;
    }
  }
});

const mockChats: Chat[] = [
  {
    id: '0',
    type: ChatType.GROUP,
    name: 'Grapegram Team',
    avatarURL: 'url to avatar',
    partisipents: ['0', '1', '2']
  },
  {
    id: '3',
    type: ChatType.GROUP,
    name: 'Team 1',
    avatarURL: 'url to avatar',
    partisipents: ['0', '1', '2']
  },
  {
    id: '1',
    type: ChatType.GROUP,
    name: 'Kirill',
    avatarURL: 'url to avatar',
    partisipents: ['2']
  },
  {
    id: '23',
    type: ChatType.GROUP,
    name: 'Andrew',
    avatarURL: 'url to avatar',
    partisipents: ['1']
  },
  {
    id: '47',
    type: ChatType.GROUP,
    name: 'Test 1',
    avatarURL: 'url to avatar',
    partisipents: ['3']
  }
];
