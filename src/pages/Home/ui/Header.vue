<script setup lang="ts">
import { AlignJustify } from 'lucide-vue-next';
import ChatAvatar from './ChatAvatar.vue';
</script>

<template>
  <header
    class="h-header flex flex-row items-center justify-start border-b px-5"
  >
    <AlignJustify :size="30" />
    <div class="ml-6">
      <ChatAvatar size="sm" class="" chat-id="1" />
      Andrew
    </div>
  </header>
</template>
