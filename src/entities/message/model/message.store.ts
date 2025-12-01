import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import type { Message } from './message.types';

export const useMessageStore = defineStore(
  'message',
  () => {
    // State: Map of chatId -> Message[]
    const messages = ref<Map<string, Message[]>>(new Map());

    // Computed
    const getMessages = (chatId: string): Message[] => {
      return messages.value.get(chatId) ?? [];
    };

    const getMessageById = (
      chatId: string,
      messageId: string
    ): Message | undefined => {
      const chatMessages = messages.value.get(chatId);
      return chatMessages?.find(m => m.id === messageId);
    };

    const allMessages = computed(() => {
      const allMsgs: Message[] = [];
      messages.value.forEach(chatMessages => {
        allMsgs.push(...chatMessages);
      });
      return allMsgs;
    });

    // Actions
    const setMessages = (chatId: string, newMessages: Message[]) => {
      messages.value.set(chatId, newMessages);
    };

    const addMessage = (message: Message) => {
      const chatMessages = messages.value.get(message.chat_id) ?? [];
      messages.value.set(message.chat_id, [...chatMessages, message]);
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
        // Mark as deleted instead of removing
        const messageIndex = chatMessages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
          const updatedMessages = [...chatMessages];
          updatedMessages[messageIndex] = {
            ...chatMessages[messageIndex],
            is_deleted: true
          };
          messages.value.set(chatId, updatedMessages);
        }
      }
    };

    const clearMessages = (chatId: string) => {
      messages.value.set(chatId, []);
    };

    const clearAllMessages = () => {
      messages.value.clear();
    };

    const addReaction = (
      chatId: string,
      messageId: string,
      reaction: string
    ) => {
      const chatMessages = messages.value.get(chatId);
      if (chatMessages) {
        const messageIndex = chatMessages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
          const updatedMessages = [...chatMessages];
          const message = updatedMessages[messageIndex];
          const currentCount = message.reactions[reaction] ?? 0;
          updatedMessages[messageIndex] = {
            ...message,
            reactions: {
              ...message.reactions,
              [reaction]: currentCount + 1
            }
          };
          messages.value.set(chatId, updatedMessages);
        }
      }
    };

    const markAsRead = (chatId: string, messageId: string, userId: string) => {
      const chatMessages = messages.value.get(chatId);
      if (chatMessages) {
        const messageIndex = chatMessages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
          const updatedMessages = [...chatMessages];
          const message = updatedMessages[messageIndex];
          if (!message.read_by.includes(userId)) {
            updatedMessages[messageIndex] = {
              ...message,
              read_by: [...message.read_by, userId]
            };
            messages.value.set(chatId, updatedMessages);
          }
        }
      }
    };

    return {
      // State
      messages,

      // Computed
      allMessages,

      // Actions
      getMessages,
      getMessageById,
      setMessages,
      addMessage,
      updateMessage,
      removeMessage,
      clearMessages,
      clearAllMessages,
      addReaction,
      markAsRead
    };
  },
  {
    persist: {
      storage: localStorage,
      key: 'grapegram_messages'
    }
  }
);
