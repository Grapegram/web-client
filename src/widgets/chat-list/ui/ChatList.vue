<script setup lang="ts">
import { computed, inject, ref } from 'vue';

import { Plus } from 'lucide-vue-next';

import { cn } from '@grapegram/ui-kit';

import { useChatStore, useGetChatsQuery } from '@/entities/chat';
import { useGetUsersQuery } from '@/entities/user';
import { CreateChatDialog } from '@/features/create-chat';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { UserProfileDialog } from '@/widgets/user-profile-dialog';

import ChatListEmpty from './ChatListEmpty.vue';
import ChatPreview from './ChatPreview.vue';
import ChatPreviewSkeleton from './ChatPreviewSkeleton.vue';
import SidebarHeader from './SidebarHeader.vue';
import UserSearchResults from './user-search/UserSearchResults.vue';

const chatStore = useChatStore();

const sidebarMode = inject<'compact' | 'expanded'>('sidebarMode', 'expanded');

// Fetch chats
const { isPending: isLoadingChats } = useGetChatsQuery();

// User search state
const isSearchMode = ref(false);
const searchQuery = ref('');
const selectedUserId = ref<string | null>(null);
const isUserProfileDialogOpen = ref(false);

// Fetch users for search
const { data: usersResponse, isPending: isLoadingUsers } = useGetUsersQuery();
const users = computed(() => usersResponse.value?.users ?? []);

// TODO: Add isPinned property to Chat type in the store
// For now, using a local ref as temporary solution
const pinnedChatsIds = computed(() => {
  // You can move this to the store or implement pinning logic
  // Example: return chatStore.orderedChats.filter(c => c.isPinned).map(c => c.id);
  return [] as string[];
});

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
const isChatsEmpty = computed(() => chatStore.orderedChats.length === 0);

function handleSearchFocus() {
  isSearchMode.value = true;
}

function handleSearchBlur() {
  // Delay to allow click events on search results to fire
  setTimeout(() => {
    isSearchMode.value = false;
  }, 200);
}

function handleSearchQueryChange(query: string) {
  searchQuery.value = query;
}

function handleUserClick(userId: string) {
  selectedUserId.value = userId;
  isUserProfileDialogOpen.value = true;
}

defineExpose({
  isChatsEmpty
});
</script>

<template>
  <div class="bg-card flex h-full grow flex-col">
    <SidebarHeader
      @search-focus="handleSearchFocus"
      @search-blur="handleSearchBlur"
      @search-query-change="handleSearchQueryChange"
    />

    <div class="relative flex-1 overflow-hidden">
      <!-- User Search Results -->
      <Transition name="slide-left">
        <div v-if="isSearchMode" key="search" class="absolute inset-0">
          <UserSearchResults
            :users="users"
            :is-loading="isLoadingUsers"
            :search-query="searchQuery"
            @user-click="handleUserClick"
          />
        </div>
        <!-- Chat List -->
        <div v-else key="chats" class="absolute inset-0">
          <ScrollArea class="h-full w-full">
            <template v-if="isLoadingChats">
              <ChatPreviewSkeleton v-for="i in 15" :key="i" />
            </template>

            <template v-else-if="isChatsEmpty">
              <ChatListEmpty />
            </template>

            <template v-else>
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
            </template>
          </ScrollArea>
        </div>
      </Transition>
    </div>

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

    <!-- User Profile Dialog -->
    <UserProfileDialog
      v-if="selectedUserId"
      v-model:open="isUserProfileDialogOpen"
      :user-id="selectedUserId"
    />
  </div>
</template>

<style scoped>
/* Slide left transition for search mode with overlap */
.slide-left-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.slide-left-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%) scale(0.95);
}

.slide-left-enter-to,
.slide-left-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}
</style>
