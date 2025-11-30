import { computed, ref, watch } from 'vue';

import { defineStore } from 'pinia';

import type { Chat, Message, MessageGroup } from './chat.types';

// Constants for localStorage keys
const STORAGE_KEYS = {
  CHAT_ORDER: 'grapegram_chat_order',
  CURRENT_CHAT: 'grapegram_current_chat'
} as const;

// Helper functions for localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Helper function to group messages
const groupMessages = (messagesArray: Message[]): MessageGroup[] => {
  const createMsgGroup = (sender: string): MessageGroup => ({
    sender: sender,
    id: '',
    messages: []
  });

  const computeId = (group: MessageGroup): string => {
    return group.messages.reduce((acc, m) => acc + `|${m.id}|`, '');
  };

  const groups = messagesArray.reduce(
    (acc: MessageGroup[], msg: Message): MessageGroup[] => {
      const currentGroup = acc.at(-1);
      const prev = currentGroup?.messages.at(-1);
      if (
        prev &&
        msg.sender === prev.sender &&
        msg.createdAt.diff(prev?.createdAt, 'minute').minutes < 10
      ) {
        currentGroup?.messages.push(msg);
      } else {
        if (currentGroup) {
          currentGroup.id = computeId(currentGroup);
        }
        const group = createMsgGroup(msg.sender);
        group.messages.push(msg);
        acc.push(group);
      }
      return acc;
    },
    [] as MessageGroup[]
  );

  // Set ID for the last group if it exists
  if (groups.length > 0) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup.id === '') {
      lastGroup.id = computeId(lastGroup);
    }
  }

  return groups;
};

export const useChatStore = defineStore('chat', () => {
  // State
  const chats = ref<Map<string, Chat>>(new Map());
  const messages = ref<Map<string, Message[]>>(new Map());

  // Load persisted data
  const chatOrder = ref<string[]>(loadFromStorage(STORAGE_KEYS.CHAT_ORDER, []));
  const currentChatId = ref<string | null>(
    loadFromStorage(STORAGE_KEYS.CURRENT_CHAT, null)
  );

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

  const currentMessages = computed(() => {
    return currentChatId.value
      ? (messages.value.get(currentChatId.value) ?? [])
      : [];
  });

  const chatCount = computed(() => chats.value.size);

  const hasChats = computed(() => chats.value.size > 0);

  const currentMessageGroups = computed<MessageGroup[]>(() => {
    return groupMessages(currentMessages.value);
  });

  const getMessageGroups = (chatId: string): MessageGroup[] => {
    const messagesArray = messages.value.get(chatId) ?? [];
    return groupMessages(messagesArray);
  };

  // Persist chat order and current chat to localStorage
  watch(
    chatOrder,
    newOrder => {
      saveToStorage(STORAGE_KEYS.CHAT_ORDER, newOrder);
    },
    { deep: true }
  );

  watch(currentChatId, newChatId => {
    saveToStorage(STORAGE_KEYS.CURRENT_CHAT, newChatId);
  });

  // Actions
  const addChat = (chat: Chat) => {
    chats.value.set(chat.id, chat);

    // Add to order if not already present
    if (!chatOrder.value.includes(chat.id)) {
      chatOrder.value.unshift(chat.id);
    }

    // Initialize messages array for this chat
    if (!messages.value.has(chat.id)) {
      messages.value.set(chat.id, []);
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
    messages.value.delete(chatId);

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

  const addMessage = (chatId: string, message: Message) => {
    const chatMessages = messages.value.get(chatId) ?? [];
    messages.value.set(chatId, [...chatMessages, message]);

    // Move chat to top of order
    moveChatToTop(chatId);

    // Update chat to reflect new activity
    const chat = chats.value.get(chatId);
    if (chat) {
      // You may want to add lastMessage and updatedAt to Chat type
      // For now, just ensuring the message is added
    }
  };

  const updateMessage = (
    chatId: string,
    messageId: string,
    updates: Partial<Message>
  ) => {
    const chatMessages = messages.value.get(chatId);
    if (chatMessages) {
      const messageIndex = chatMessages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        const updatedMessages = [...chatMessages];
        updatedMessages[messageIndex] = {
          ...chatMessages[messageIndex],
          ...updates
        };
        messages.value.set(chatId, updatedMessages);
      }
    }
  };

  const removeMessage = (chatId: string, messageId: string) => {
    const chatMessages = messages.value.get(chatId);
    if (chatMessages) {
      const filteredMessages = chatMessages.filter(m => m.id !== messageId);
      messages.value.set(chatId, filteredMessages);
    }
  };

  const getMessages = (chatId: string): Message[] => {
    return messages.value.get(chatId) ?? [];
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

  const clearMessages = (chatId: string) => {
    messages.value.set(chatId, []);
  };

  const clearAllChats = () => {
    chats.value.clear();
    messages.value.clear();
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

  const getUnreadCount = (chatId?: string): number => {
    // Count unread messages - you may want to add an isRead property to Message type
    // For now, returning 0 as placeholder
    // Implementation depends on your Message model having a read/unread status
    return 0;
  };

  return {
    // State
    chats,
    messages,
    chatOrder,
    currentChatId,

    // Computed
    orderedChats,
    currentChat,
    currentMessages,
    currentMessageGroups,
    chatCount,
    hasChats,

    // Actions
    addChat,
    updateChat,
    removeChat,
    setCurrentChat,
    addMessage,
    updateMessage,
    removeMessage,
    getMessages,
    moveChatToTop,
    reorderChats,
    clearMessages,
    clearAllChats,
    getChatById,
    searchChats,
    getUnreadCount,
    getMessageGroups
  };
});
