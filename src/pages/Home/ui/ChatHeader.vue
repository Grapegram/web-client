<script setup lang="ts">
import { computed, ref } from 'vue';

import { UserPlus } from 'lucide-vue-next';

import { useChatStore } from '@/entities/chat';
import { useMockData } from '@/entities/user';
import { ChatAvatar } from '@/features/chat-avatar';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';
import { UsersList } from '@/widgets/users-list';

const chatStore = useChatStore();

// Initialize mock data for testing
useMockData();

const currentChat = computed(() => chatStore.currentChat);
const chatTitle = computed(
  () => currentChat.value?.title || 'No chat selected'
);
const chatId = computed(() => currentChat.value?.id || '');

const isAddUserDialogOpen = ref(false);
const selectedUserIds = ref<string[]>([]);

const handleSelectUser = (userId: string) => {
  console.log('User selected:', userId);
};

const handleAddUsers = () => {
  if (selectedUserIds.value.length > 0 && currentChat.value) {
    console.log('Adding users to chat:', selectedUserIds.value);
    // TODO: Implement actual user addition logic
    // This would typically call an API or update the chat store

    // Reset and close
    selectedUserIds.value = [];
    isAddUserDialogOpen.value = false;
  }
};

const handleCancelAddUsers = () => {
  selectedUserIds.value = [];
  isAddUserDialogOpen.value = false;
};
</script>

<template>
  <header
    class="h-header bg-card border-border flex flex-row items-center justify-between gap-3 rounded border p-3"
  >
    <ChatAvatar size="sm" class="" :chat-id="chatId" />
    <div class="flex grow flex-col items-start justify-center">
      <span
        ><strong>{{ chatTitle }}</strong></span
      >
      <span v-if="!currentChat" class="text-muted-foreground"
        >Select a chat to start messaging</span
      >
    </div>

    <div class="flex items-center gap-2">
      <Dialog v-model:open="isAddUserDialogOpen">
        <DialogTrigger as-child>
          <Button
            v-if="currentChat"
            variant="ghost"
            size="icon"
            :disabled="!currentChat"
          >
            <UserPlus :size="24" />
          </Button>
        </DialogTrigger>
        <DialogContent class="max-h-[80vh] max-w-md">
          <DialogHeader>
            <DialogTitle>Add Users to Chat</DialogTitle>
            <DialogDescription>
              Select users to add to {{ chatTitle }}
            </DialogDescription>
          </DialogHeader>

          <div class="h-[400px]">
            <UsersList
              v-model:selected-user-ids="selectedUserIds"
              selectable
              multi-select
              @select-user="handleSelectUser"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" @click="handleCancelAddUsers">
              Cancel
            </Button>
            <Button
              :disabled="selectedUserIds.length === 0"
              @click="handleAddUsers"
            >
              Add
              {{
                selectedUserIds.length > 0 ? `(${selectedUserIds.length})` : ''
              }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </header>
</template>
