<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next';
import ChatAvatar from './ChatAvatar.vue';
import { useChatStore } from '../model/chat';
import { computed } from 'vue';

const chatStore = useChatStore();
const chat = computed(() => chatStore.currentChat);
</script>

<template>
  <header
    class="h-header bg-card border-border flex flex-row items-center justify-between gap-3 rounded border p-3"
  >
    <ChatAvatar size="sm" class="" :chat-id="chat?.id ?? ''" />
    <div class="flex grow flex-col items-start justify-center">
      <span
        ><strong>{{ chat?.name }}</strong></span
      >
      <span>additional data</span>
    </div>
    <EllipsisVertical :size="30" />
  </header>
</template>
