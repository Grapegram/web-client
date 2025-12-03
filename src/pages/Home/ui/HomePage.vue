<script setup lang="ts">
import { computed, ref } from 'vue';

import { ChatList } from '@/widgets/chat-list';

import { init } from '../lib/initData';
import ChatView from './ChatView.vue';
import ResizableSidebarLayout, {
  Percentage,
  Px
} from './ResizableSidebarLayout.vue';

init();

const chatListRef = ref<InstanceType<typeof ChatList>>();
const canCollapseSidebar = computed(() => !chatListRef.value?.isChatsEmpty);
</script>

<template>
  <div class="flex h-dvh w-dvw flex-col">
    <ResizableSidebarLayout
      :collapsed-size="Px(90)"
      :min-size="Px(350)"
      :max-size="Percentage(35)"
      :can-collapse-sidebar="canCollapseSidebar"
      class="flex-1"
      auto-save-id="main"
    >
      <template #sidebar>
        <ChatList ref="chatListRef" />
      </template>
      <template #content>
        <ChatView />
      </template>
    </ResizableSidebarLayout>
  </div>
</template>
