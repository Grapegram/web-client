<script lang="ts">
type Variants = 'compact' | 'expanded';
type Props = {
  chatId: string;
  class?: string;
  variant?: Variants;
  isActive?: boolean;
  isPinned?: boolean;
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

import { ChatType, useChatStore } from '@/entities/chat';

import DirectChatPreview from './DirectChatPreview.vue';
import GroupChatPreview from './GroupChatPreview.vue';

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  isPinned: false,
  variant: 'expanded'
});

// Store
const chatStore = useChatStore();

// Computed from store
const chat = computed(() => chatStore.getChatById(props.chatId));

// TODO: Implement unread count logic in your store
// For now, returning 0 as placeholder
const unreaded = computed(() => chatStore.getUnreadCount(props.chatId));

const isDirectChat = computed(() => chat.value?.type === ChatType.DIRECT);
const isGroupChat = computed(() => chat.value?.type === ChatType.GROUP);
</script>

<template>
  <div v-if="chat" @click="chatStore.setCurrentChat(chatId)">
    <DirectChatPreview
      v-if="isDirectChat"
      :chat="chat"
      :class="props.class"
      :variant="props.variant"
      :is-active="isActive"
      :is-pinned="isPinned"
      :unreaded="unreaded"
    />

    <GroupChatPreview
      v-else-if="isGroupChat"
      :chat="chat"
      :class="props.class"
      :variant="props.variant"
      :is-active="isActive"
      :is-pinned="isPinned"
      :unreaded="unreaded"
    />
  </div>
</template>
