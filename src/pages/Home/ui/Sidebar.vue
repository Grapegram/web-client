<script setup lang="ts">
import ChatPreview from './ChatPreview.vue';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { inject } from 'vue';
import { computed } from 'vue';
import { useChatStore } from '../model/chat';
import { useMessagesStore } from '../model/messages';
import type { Chat, ChatData, ChatId } from '../model/chat';

const sidebarMode = inject<'compact' | 'expanded'>('sidebarMode');

const chatStore = useChatStore();
const messagesStore = useMessagesStore();

function sortByMessageTime(chats: ChatData[]): ChatData[] {
  const getLastMessageTimeSecs = (chat: ChatData): number =>
    chat.messages.at(-1)?.createTime?.toSeconds() ?? -1;
  return [...chats].sort((a, b) =>
    getLastMessageTimeSecs(a) < getLastMessageTimeSecs(b) ? 1 : -1
  );
}

function attachMessagesToChat(chat: Chat) {
  return { ...chat, messages: messagesStore.getChatMessages(chat.id) };
}

const activeChatId = computed(() => chatStore.currentChatId);
const unpinnedChats = computed(() =>
  sortByMessageTime(chatStore.unpinnedChats.map(attachMessagesToChat))
);
const pinnedChats = chatStore.pinnedChats;

function selectThisChat(chatId: ChatId) {
  chatStore.setCurrentChat(chatId);
}
</script>

<template>
  <div class="bg-card h-full grow">
    <ScrollArea class="h-full w-full">
      <ChatPreview
        v-for="chat in pinnedChats"
        :key="chat.id"
        :chat-id="chat.id"
        :variant="sidebarMode"
        :is-active="activeChatId === chat.id"
        @click="selectThisChat(chat.id)"
        is-pinned
      />
      <ChatPreview
        v-for="chat in unpinnedChats"
        :key="chat.id"
        :chat-id="chat.id"
        :variant="sidebarMode"
        :is-active="activeChatId === chat.id"
        @click="selectThisChat(chat.id)"
      />
    </ScrollArea>
  </div>
</template>
