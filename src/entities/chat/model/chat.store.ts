import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import type { Chat } from './chat.types';

export const useChatStore = defineStore(
  'chat',
  () => {
    // State
    const chats = ref<Map<string, Chat>>(new Map());
    const chatOrder = ref<string[]>([]);
    const currentChatId = ref<string | null>(null);

    // Computed
    const orderedChats = computed(() => {
      return chatOrder.value
        .map(id => chats.value.get(id))
        .filter((chat): chat is Chat => chat !== undefined);
    });

    const currentChat = computed(() => {
      return currentChatId.value
        ? (chats.value.get(currentChatId.value) ?? null)
        : null;
    });

    const chatCount = computed(() => chats.value.size);

    const hasChats = computed(() => chats.value.size > 0);

    // Actions
    const addChat = (chat: Chat) => {
      chats.value.set(chat.id, chat);

      // Add to order if not already present
      if (!chatOrder.value.includes(chat.id)) {
        chatOrder.value.unshift(chat.id);
      }
    };

    const updateChat = (chatId: string, updates: Partial<Chat>) => {
      const chat = chats.value.get(chatId);
      if (chat) {
        chats.value.set(chatId, { ...chat, ...updates });
      }
    };

    const removeChat = (chatId: string) => {
      chats.value.delete(chatId);

      // Remove from order
      const index = chatOrder.value.indexOf(chatId);
      if (index !== -1) {
        chatOrder.value.splice(index, 1);
      }

      // Clear current chat if it was removed
      if (currentChatId.value === chatId) {
        currentChatId.value = chatOrder.value[0] ?? null;
      }
    };

    const setCurrentChat = (chatId: string | null) => {
      if (chatId === null || chats.value.has(chatId)) {
        currentChatId.value = chatId;
      }
    };

    const moveChatToTop = (chatId: string) => {
      const index = chatOrder.value.indexOf(chatId);
      if (index !== -1) {
        chatOrder.value.splice(index, 1);
      }
      chatOrder.value.unshift(chatId);
    };

    const reorderChats = (newOrder: string[]) => {
      // Validate that all IDs exist
      const validOrder = newOrder.filter(id => chats.value.has(id));
      chatOrder.value = validOrder;
    };

    const clearAllChats = () => {
      chats.value.clear();
      chatOrder.value = [];
      currentChatId.value = null;
    };

    const getChatById = (chatId: string): Chat | undefined => {
      return chats.value.get(chatId);
    };

    const searchChats = (query: string): Chat[] => {
      const lowerQuery = query.toLowerCase();
      return Array.from(chats.value.values()).filter(chat =>
        chat.title?.toLowerCase().includes(lowerQuery)
      );
    };

    const getUnreadCount = (_chatId?: string): number => {
      // TODO: Implement unread count based on read_by field
      return 0;
    };

    const updateChatAvatar = (chatId: string, avatarUrl: string) => {
      const chat = chats.value.get(chatId);
      if (chat) {
        chats.value.set(chatId, { ...chat, avatar: avatarUrl });
      }
    };

    const setChats = (fetchedChats: Chat[]) => {
      chats.value = new Map(fetchedChats.map(chat => [chat.id, chat]));

      chatOrder.value = fetchedChats.map(c => c.id);

      if (!currentChatId.value) {
        currentChatId.value = chatOrder.value[0] ?? null;
      }
    };

    return {
      // State
      chats,
      chatOrder,
      currentChatId,

      // Computed
      orderedChats,
      currentChat,
      chatCount,
      hasChats,

      // Actions
      addChat,
      updateChat,
      removeChat,
      setCurrentChat,
      moveChatToTop,
      reorderChats,
      clearAllChats,
      getChatById,
      searchChats,
      getUnreadCount,
      updateChatAvatar,
      setChats
    };
  },
  {
    persist: {
      storage: localStorage,
      key: 'chats',
      pick: ['chatOrder', 'currentChatId']
    }
  }
);
