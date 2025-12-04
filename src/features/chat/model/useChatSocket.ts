import { computed, ref } from 'vue';

import {
  type ChatAddedEvent,
  type MessageDeletedEvent,
  type MessageEditedEvent,
  type MessageSentEvent,
  useChatStore,
  useFetchChatByIdMutation
} from '@/entities/chat';
import { useMessageStore } from '@/entities/message';
import type { Message } from '@/entities/message';
import {
  type UserOfflineEvent,
  type UserOnlineEvent,
  type UserTypingStartedEvent,
  type UserTypingStoppedEvent,
  useUserStore
} from '@/entities/user';
import { GLOBAL_EVENT_EMITTER, PrivateSocketClient } from '@/shared/api';

export function useConcreteChatSocket(chatId: string, token: string) {
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const store = useMessageStore();

  const socket = new PrivateSocketClient(`ws/chat/${chatId}`, token);

  const isConnected = ref(false);
  const isAuthorized = ref(false);

  const sendStartTypingEvent = () => {
    socket.send({
      action: 'start_typing',
      chat_id: chatId,
      user_id: userStore.user.id
    });
  };

  const sendStopTypingEvent = () => {
    socket.send({
      action: 'stop_typing',
      chat_id: chatId,
      user_id: userStore.user.id
    });
  };

  // === HANDLERS ===

  const handleMessageSent = (payload?: unknown) => {
    const data = payload as MessageSentEvent;
    const message: Message = {
      id: data.message_id,
      chat_id: data.chat_id,
      sender_id: data.sender_id,
      text: data.text,
      images: data.images,
      sent_at: data.sent_at,
      edited_at: null,
      reactions: {},
      read_by: []
    };

    store.addMessage(message);
  };

  const handleMessageEdited = (payload?: unknown) => {
    const data = payload as MessageEditedEvent;
    store.updateMessage(data.chat_id, data.message_id, {
      text: data.new_text,
      edited_at: data.edited_at
    });
  };

  const handleMessageDeleted = (payload?: unknown) => {
    const data = payload as MessageDeletedEvent;
    store.removeMessage(data.chat_id, data.message_id);
  };

  const handleUserTypingStarted = (payload?: unknown) => {
    const data = payload as UserTypingStartedEvent;

    // Set member typing status in the chat
    chatStore.setMemberTyping(data.chat_id, data.user_id, true);
  };

  const handleUserTypingStopped = (payload?: unknown) => {
    const data = payload as UserTypingStoppedEvent;

    // Remove member typing status in the chat
    chatStore.setMemberTyping(data.chat_id, data.user_id, false);
  };

  // === LIFECYCLE ===

  const connect = () => {
    GLOBAL_EVENT_EMITTER.on('start_typing', (payload?: unknown) => {
      const e_chat_id = payload as string;
      if (e_chat_id !== chatId) return;
      sendStartTypingEvent();
    });
    GLOBAL_EVENT_EMITTER.on('stop_typing', (payload?: unknown) => {
      const e_chat_id = payload as string;
      if (e_chat_id !== chatId) return;
      sendStopTypingEvent();
    });
    socket.emitter.on('message_sent', handleMessageSent);
    socket.emitter.on('message_edited', handleMessageEdited);
    socket.emitter.on('message_deleted', handleMessageDeleted);
    socket.emitter.on('user_typing_started', handleUserTypingStarted);
    socket.emitter.on('user_typing_stopped', handleUserTypingStopped);
    socket.connect();
  };

  const disconnect = () => {
    socket.emitter.off('message_sent', handleMessageSent);
    socket.emitter.off('message_edited', handleMessageEdited);
    socket.emitter.off('message_deleted', handleMessageDeleted);
    socket.emitter.off('user_typing_started', handleUserTypingStarted);
    socket.emitter.off('user_typing_stopped', handleUserTypingStopped);
    socket.disconnect();
  };

  return {
    socket,
    isConnected,
    isAuthorized,
    connect,
    disconnect,
    messages: computed(() => store.getMessages(chatId)),
    messageGroups: computed(() => store.getMessageGroups(chatId))
  };
}

export function useChatSocket(userId: string, token: string) {
  const userStore = useUserStore();
  const socket = new PrivateSocketClient(`ws/chat-events/${userId}`, token);

  const isConnected = ref(false);
  const isAuthorized = ref(false);

  const { mutate: fetchChatById } = useFetchChatByIdMutation();

  let pingInterval: ReturnType<typeof setInterval> | null = null;

  // === PING ===

  const startPing = () => {
    // Clear existing interval if any
    if (pingInterval) {
      clearInterval(pingInterval);
    }
    // Send ping every 30 seconds
    pingInterval = setInterval(() => {
      socket.send({ action: 'ping' });
    }, 30000);
  };

  const stopPing = () => {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
  };

  // === HANDLERS ===

  const handleChatAdded = async (payload?: unknown) => {
    const data = payload as ChatAddedEvent;

    // Fetch the full chat data and update the store
    fetchChatById(data.chat_id);
  };

  const handleUserOnline = (payload?: unknown) => {
    const data = payload as UserOnlineEvent;

    // Update user online status
    userStore.setUserOnline(data.user_id);
  };

  const handleUserOffline = (payload?: unknown) => {
    const data = payload as UserOfflineEvent;

    // Update user offline status
    userStore.setUserOffline(data.user_id);
  };

  // === LIFECYCLE ===

  const connect = () => {
    socket.emitter.on('member_added', handleChatAdded);
    socket.emitter.on('user_online', handleUserOnline);
    socket.emitter.on('user_offline', handleUserOffline);

    // Start ping when authorized
    socket.emitter.on('authorized', startPing);

    socket.connect();
  };

  const disconnect = () => {
    stopPing();

    socket.emitter.off('member_added', handleChatAdded);
    socket.emitter.off('user_online', handleUserOnline);
    socket.emitter.off('user_offline', handleUserOffline);
    socket.emitter.off('authorized', startPing);

    socket.disconnect();
  };

  return {
    socket,
    isConnected,
    isAuthorized,
    connect,
    disconnect
  };
}
