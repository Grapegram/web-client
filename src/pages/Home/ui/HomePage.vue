<script setup lang="ts">
import { ChatList } from '@/widgets/chat-list';

import { init } from '../lib/initData';
import ChatView from './ChatView.vue';
import Header from './Header.vue';
import ResizableSidebarLayout, {
  Percentage,
  Px
} from './ResizableSidebarLayout.vue';

init();
</script>

<template>
  <div class="flex h-dvh w-dvw flex-col">
    <Header />
    <ResizableSidebarLayout
      :collapsed-size="Px(90)"
      :min-size="Px(350)"
      :max-size="Percentage(35)"
      class="flex-1"
      auto-save-id="main"
    >
      <template #sidebar>
        <ChatList />
      </template>
      <template #content>
        <ChatView />
      </template>
    </ResizableSidebarLayout>
  </div>
</template>
