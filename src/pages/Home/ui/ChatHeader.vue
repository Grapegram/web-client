<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next';
import ChatAvatar from './ChatAvatar.vue';
</script>

<template>
  <header
    class="h-header bg-card border-border flex flex-row items-center justify-between gap-3 rounded border p-3"
  >
    <ChatAvatar size="sm" class="" chat-id="1" />
    <div class="flex grow flex-col items-start justify-center">
      <span><strong>Pied Piper</strong></span>
      <span>additional data</span>
    </div>
    <EllipsisVertical :size="30" />
  </header>
</template>
