import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import type { Chat, Message, MessageGroup } from './chat.types';

// Helper function to group messages
const groupMessages = (messagesArray: Message[]): MessageGroup[] => {
  const createMsgGroup = (sender_id: string): MessageGroup => ({
    sender_id: sender_id,
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

      // Group messages by sender and time proximity (10 minutes)
      if (prev && msg.sender_id === prev.sender_id) {
        const prevTime = new Date(prev.created_at).getTime();
        const msgTime = new Date(msg.created_at).getTime();
        const diffMinutes = (msgTime - prevTime) / (1000 * 60);

        if (diffMinutes < 10) {
          currentGroup?.messages.push(msg);
          return acc;
        }
      }

      // Create new group
      if (currentGroup) {
        currentGroup.id = computeId(currentGroup);
      }
      const group = createMsgGroup(msg.sender_id);
      group.messages.push(msg);
      acc.push(group);
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

export const useChatStore = defineStore(
  'chat',
  () => {
    // State
    const chats = ref<Map<string, Chat>>(new Map());
    const messages = ref<Map<string, Message[]>>(new Map());
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
      moveChatToTop(chatId);
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
      // TODO: Implement unread count based on read_by field
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
  },
  {
    persist: {
      storage: localStorage,
      key: 'grapegram_chats',
      pick: ['chatOrder', 'currentChatId']
    }
  }
);
