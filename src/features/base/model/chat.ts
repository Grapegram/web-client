import { defineStore } from 'pinia';
import type { Message } from './messages';
import type { UserId } from './user';
import { chatService } from '../api/api';

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
    chats: [],
    currentChatId: null,
    pinnedChatsIds: new Set([])
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
    },

    async loadChats() {
      const chats = await chatService.loadChats();
      this.chats = chats ?? [];
    }
  }
});
