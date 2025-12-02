import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import type { Message, MessageGroup } from './message.types';

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
        const prevTime = new Date(prev.sent_at).getTime();
        const msgTime = new Date(msg.sent_at).getTime();
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

export const useMessageStore = defineStore('message', () => {
  // State: Record of chatId -> Message[]
  const messages = ref<Record<string, Message[]>>({});

  // Computed
  const getMessages = (chatId: string): Message[] => {
    return messages.value[chatId] ?? [];
  };

  const getMessageById = (
    chatId: string,
    messageId: string
  ): Message | undefined => {
    const chatMessages = messages.value[chatId];
    return chatMessages?.find(m => m.id === messageId);
  };

  const allMessages = computed(() => {
    const allMsgs: Message[] = [];
    Object.values(messages.value).forEach(chatMessages => {
      allMsgs.push(...chatMessages);
    });
    return allMsgs;
  });

  // Actions
  const setMessages = (chatId: string, newMessages: Message[]) => {
    messages.value[chatId] = newMessages;
  };

  const addMessage = (message: Message) => {
    const chatMessages = messages.value[message.chat_id] ?? [];
    messages.value[message.chat_id] = [...chatMessages, message];
  };

  const updateMessage = (
    chatId: string,
    messageId: string,
    updates: Partial<Message>
  ) => {
    const chatMessages = messages.value[chatId];
    if (chatMessages) {
      const messageIndex = chatMessages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        const updatedMessages = [...chatMessages];
        updatedMessages[messageIndex] = {
          ...chatMessages[messageIndex],
          ...updates
        };
        messages.value[chatId] = updatedMessages;
      }
    }
  };

  const removeMessage = (chatId: string, messageId: string) => {
    const chatMessages = messages.value[chatId];
    if (chatMessages) {
      const updatedMessages = chatMessages.filter(m => m.id !== messageId);
      messages.value[chatId] = updatedMessages;
    }
  };

  const clearMessages = (chatId: string) => {
    messages.value[chatId] = [];
  };

  const clearAllMessages = () => {
    messages.value = {};
  };

  const addReaction = (
    chatId: string,
    messageId: string,
    reaction: string,
    userId: string
  ) => {
    const chatMessages = messages.value[chatId];
    if (chatMessages) {
      const messageIndex = chatMessages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        const updatedMessages = [...chatMessages];
        const message = updatedMessages[messageIndex];
        const currentUsers = message.reactions[reaction] ?? [];
        if (!currentUsers.includes(userId)) {
          updatedMessages[messageIndex] = {
            ...message,
            reactions: {
              ...message.reactions,
              [reaction]: [...currentUsers, userId]
            }
          };
          messages.value[chatId] = updatedMessages;
        }
      }
    }
  };

  const removeReaction = (
    chatId: string,
    messageId: string,
    reaction: string,
    userId: string
  ) => {
    const chatMessages = messages.value[chatId];
    if (chatMessages) {
      const messageIndex = chatMessages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        const updatedMessages = [...chatMessages];
        const message = updatedMessages[messageIndex];
        const currentUsers = message.reactions[reaction] ?? [];
        const filteredUsers = currentUsers.filter(id => id !== userId);

        const newReactions = { ...message.reactions };
        if (filteredUsers.length === 0) {
          delete newReactions[reaction];
        } else {
          newReactions[reaction] = filteredUsers;
        }

        updatedMessages[messageIndex] = {
          ...message,
          reactions: newReactions
        };
        messages.value[chatId] = updatedMessages;
      }
    }
  };

  const markAsRead = (chatId: string, messageId: string, userId: string) => {
    const chatMessages = messages.value[chatId];
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
          messages.value[chatId] = updatedMessages;
        }
      }
    }
  };

  const getMessageGroups = (chatId: string): MessageGroup[] => {
    const messagesArray = messages.value[chatId] ?? [];
    return groupMessages(messagesArray);
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
    removeReaction,
    markAsRead,
    getMessageGroups
  };
});
