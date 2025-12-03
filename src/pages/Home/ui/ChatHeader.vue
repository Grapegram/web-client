<script setup lang="ts">
import { computed } from 'vue';

import { ChatType, useChatStore } from '@/entities/chat';

import DirectChatHeader from './DirectChatHeader.vue';
import GroupChatHeader from './GroupChatHeader.vue';

const chatStore = useChatStore();

const currentChat = computed(() => chatStore.currentChat);

const isDirectChat = computed(
  () => currentChat.value?.type === ChatType.DIRECT
);
const isGroupChat = computed(() => currentChat.value?.type === ChatType.GROUP);
</script>

<template>
  <div v-if="currentChat">
    <DirectChatHeader v-if="isDirectChat" :chat="currentChat" />
    <GroupChatHeader v-else-if="isGroupChat" :chat="currentChat" />
  </div>
  <header
    v-else
    class="h-header bg-card border-border flex flex-row items-center justify-between gap-3 rounded-lg border p-3"
  >
    <div class="flex grow flex-col items-start justify-center">
      <span class="text-muted-foreground italic">No chat selected</span>
    </div>
  </header>
</template>
