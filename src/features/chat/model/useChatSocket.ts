import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { useMessageStore } from '@/entities/message';
import type { Message } from '@/entities/message';
import { ChatSocketClient } from '@/shared/api';
import type {
  MessageDeletedEvent,
  MessageEditedEvent,
  MessageReactionAddedEvent,
  MessageReactionRemovedEvent,
  MessageReadEvent,
  MessageSentEvent
} from '@/shared/api';

/**
 * Composable for managing WebSocket connection and real-time message updates
 *
 * Handles:
 * - WebSocket connection lifecycle
 * - Real-time message events (sent, edited, deleted)
 * - Message reactions (added, removed)
 * - Message read status
 * - Connection state tracking
 *
 * @param chatId - ID of the chat to connect to
 * @param token - JWT authentication token
 *
 * @returns {Object} Socket connection and state
 * @returns {ChatSocketClient} socket - WebSocket client instance
 * @returns {Ref<boolean>} isConnected - Connection status
 * @returns {Ref<boolean>} isAuthorized - Authorization status
 * @returns {ComputedRef<Message[]>} messages - Reactive messages for the chat
 * @returns {ComputedRef<MessageGroup[]>} messageGroups - Grouped messages for display
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useChatSocket } from 'features/chat';
 *
 * const chatId = 'your-chat-id';
 * const token = 'your-jwt-token';
 *
 * const { isConnected, isAuthorized, messages, messageGroups } = useChatSocket(chatId, token);
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Connected: {{ isConnected }}</p>
 *     <p>Authorized: {{ isAuthorized }}</p>
 *     <div v-for="group in messageGroups" :key="group.id">
 *       <!-- Render message group -->
 *     </div>
 *   </div>
 * </template>
 * ```
 */
export function useChatSocket(chatId: string, token: string) {
  const store = useMessageStore();
  const socket = new ChatSocketClient(chatId, token);

  const isConnected = ref(false);
  const isAuthorized = ref(false);

  // === HANDLERS ===

  const handleMessageSent = (payload?: unknown) => {
    console.log('sended');
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

  const handleMessageReactionAdded = (payload?: unknown) => {
    const data = payload as MessageReactionAddedEvent;
    store.addReaction(
      data.chat_id,
      data.message_id,
      data.reaction,
      data.user_id
    );
  };

  const handleMessageReactionRemoved = (payload?: unknown) => {
    const data = payload as MessageReactionRemovedEvent;
    store.removeReaction(
      data.chat_id,
      data.message_id,
      data.reaction,
      data.user_id
    );
  };

  const handleMessageRead = (payload?: unknown) => {
    const data = payload as MessageReadEvent;
    store.markAsRead(data.chat_id, data.message_id, data.user_id);
  };

  const handleConnected = () => {
    console.log('connected to chat socket');
    isConnected.value = true;
  };

  const handleDisconnected = () => {
    console.log('disconnected from chat socket');
    isConnected.value = false;
    isAuthorized.value = false;
  };

  const handleAuthorized = () => {
    console.log('authorized on chat socket');
    isAuthorized.value = true;
  };

  const handleUnauthorized = () => {
    console.log('unauthorized on chat socket');
    isAuthorized.value = false;
  };

  // === LIFECYCLE ===

  onMounted(() => {
    // Message events
    socket.emitter.on('MessageSent', handleMessageSent);
    socket.emitter.on('MessageEdited', handleMessageEdited);
    socket.emitter.on('MessageDeleted', handleMessageDeleted);
    socket.emitter.on('MessageReactionAdded', handleMessageReactionAdded);
    socket.emitter.on('MessageReactionRemoved', handleMessageReactionRemoved);
    socket.emitter.on('MessageRead', handleMessageRead);

    // Connection events
    socket.emitter.on('connected', handleConnected);
    socket.emitter.on('disconnected', handleDisconnected);
    socket.emitter.on('authorized', handleAuthorized);
    socket.emitter.on('unauthorized', handleUnauthorized);

    // Connect to WebSocket
    socket.connect();
  });

  onBeforeUnmount(() => {
    // Cleanup: remove all event listeners
    socket.emitter.off('MessageSent', handleMessageSent);
    socket.emitter.off('MessageEdited', handleMessageEdited);
    socket.emitter.off('MessageDeleted', handleMessageDeleted);
    socket.emitter.off('MessageReactionAdded', handleMessageReactionAdded);
    socket.emitter.off('MessageReactionRemoved', handleMessageReactionRemoved);
    socket.emitter.off('MessageRead', handleMessageRead);

    socket.emitter.off('connected', handleConnected);
    socket.emitter.off('disconnected', handleDisconnected);
    socket.emitter.off('authorized', handleAuthorized);
    socket.emitter.off('unauthorized', handleUnauthorized);

    // Disconnect socket
    socket.disconnect();
  });

  return {
    socket,
    isConnected,
    isAuthorized,
    messages: computed(() => store.getMessages(chatId)),
    messageGroups: computed(() => store.getMessageGroups(chatId))
  };
}
