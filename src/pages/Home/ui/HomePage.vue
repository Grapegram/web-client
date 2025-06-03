<script setup lang="ts">
import ResizableSidebarLayout, {
  Percentage,
  Px
} from './ResizableSidebarLayout.vue';
import Sidebar from './Sidebar.vue';
import Chat from './Chat.vue';
import Header from './Header.vue';
import { onMounted } from 'vue';
import { useChatStore } from '@features/base/model/chat';
import { useMessagesStore } from '@/features/base/model/messages';
import { useUserStore } from '@/features/base/model/user';

const chatStore = useChatStore();
const userStore = useUserStore();
const messagesStore = useMessagesStore();

onMounted(async () => {
  await userStore.loadUsers();
  await chatStore.loadChats();
  const updateChats = async () => {
    for (const chat of chatStore.chats) {
      await messagesStore.loadMessages(chat.id);
    }
  };
  updateChats();
  setInterval(updateChats, 3000);
});
</script>

<template>
  <div class="h-dvh w-dvw">
    <Header />
    <ResizableSidebarLayout
      :collapsed-size="Px(90)"
      :min-size="Px(350)"
      :max-size="Percentage(35)"
      class="h-[calc(100%-var(--height-header))]!"
      auto-save-id="main"
    >
      <template #sidebar>
        <Sidebar />
      </template>
      <template #content>
        <Chat />
      </template>
    </ResizableSidebarLayout>
  </div>
</template>
