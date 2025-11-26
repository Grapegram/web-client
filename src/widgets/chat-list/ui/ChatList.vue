<script setup lang="ts">
import { computed, inject } from 'vue';

import { Plus } from 'lucide-vue-next';

import { cn } from '@grapegram/ui-kit';

import { useChatStore } from '@/entities/chat';
import { CreateChatDialog } from '@/features/create-chat';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';

import { ChatPreview } from './ChatPreview.vue';

// Store
const chatStore = useChatStore();

// Injected props
const sidebarMode = inject<'compact' | 'expanded'>('sidebarMode', 'expanded');

// TODO: Add isPinned property to Chat type in the store
// For now, using a local ref as temporary solution
const pinnedChatsIds = computed(() => {
  // You can move this to the store or implement pinning logic
  // Example: return chatStore.orderedChats.filter(c => c.isPinned).map(c => c.id);
  return [] as string[];
});

// Computed
const pinnedChats = computed(() => {
  return chatStore.orderedChats.filter(chat =>
    pinnedChatsIds.value.includes(chat.id)
  );
});

const unpinnedChats = computed(() => {
  return chatStore.orderedChats.filter(
    chat => !pinnedChatsIds.value.includes(chat.id)
  );
});

const activeChatId = computed(() => chatStore.currentChatId);
</script>

<template>
  <div class="bg-card flex h-full grow flex-col">
    <ScrollArea class="h-full w-full flex-1">
      <ChatPreview
        v-for="chat in pinnedChats"
        :key="chat.id"
        :chat-id="chat.id"
        :variant="sidebarMode"
        :is-active="activeChatId === chat.id"
        is-pinned
      />
      <ChatPreview
        v-for="chat in unpinnedChats"
        :key="chat.id"
        :chat-id="chat.id"
        :variant="sidebarMode"
        :is-active="activeChatId === chat.id"
      />
    </ScrollArea>
    <div
      :class="cn('border-border flex items-center justify-center border-t p-3')"
    >
      <CreateChatDialog as-child>
        <Button
          :class="
            cn('flex flex-1 items-center', {
              'justify-between': sidebarMode == 'expanded',
              'justify-center': sidebarMode == 'compact'
            })
          "
          variant="ghost"
        >
          <h2 v-if="sidebarMode == 'expanded'" class="text-lg font-semibold">
            Chats
          </h2>
          <Plus :size="18" />
        </Button>
      </CreateChatDialog>
    </div>
  </div>
</template>
