<script setup lang="ts">
import { AlignJustify } from 'lucide-vue-next';
import ChatAvatar from './ChatAvatar.vue';
import ActionBar from './ActionBar.vue';
</script>

<template>
  <header
    class="h-header bg-card flex flex-row items-center justify-between border-b px-5"
  >
    <AlignJustify :size="30" />
    <ActionBar />
    <ChatAvatar size="sm" class="" chat-id="1" />
  </header>
</template>
