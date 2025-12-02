<script setup lang="ts">
import { computed, ref } from 'vue';

import { EllipsisVertical, ImageIcon, UserPlus } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import { useChatStore, useUploadChatAvatarMutation } from '@/entities/chat';
import { useMockData } from '@/entities/user';
import { AvatarEditorDialog } from '@/features/avatar-editor';
import type { CroppedImageResult } from '@/features/avatar-editor';
import { ChatAvatar } from '@/features/chat-avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { AddUsersDialog } from '@/widgets/add-users-dialog';

const chatStore = useChatStore();

// Initialize mock data for testing
useMockData();

const currentChat = computed(() => chatStore.currentChat);
const chatTitle = computed(
  () => currentChat.value?.title || 'No chat selected'
);
const chatId = computed(() => currentChat.value?.id || '');

const isAddUserDialogOpen = ref(false);
const isAvatarDialogOpen = ref(false);

const { mutate: uploadAvatar } = useUploadChatAvatarMutation(chatId.value);

const handleAddUsers = (userIds: string[]) => {
  if (userIds.length > 0 && currentChat.value) {
    console.log('Adding users to chat:', userIds);
    // TODO: Implement actual user addition logic
    // This would typically call an API or update the chat store
  }
};

const handleCancelAddUsers = () => {
  console.log('User addition cancelled');
};

function handleOpenAvatarDialog() {
  isAvatarDialogOpen.value = true;
}

async function handleAvatarSave(result: CroppedImageResult) {
  try {
    await uploadAvatar(result.file);
    toast.success('Chat avatar updated successfully!');
  } catch {
    toast.error('Failed to upload chat avatar. Please try again.');
  }
}
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
      <DropdownMenu v-if="currentChat">
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" :disabled="!currentChat">
            <EllipsisVertical :size="24" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="handleOpenAvatarDialog">
            <ImageIcon :size="16" class="mr-2" />
            Change Avatar
          </DropdownMenuItem>
          <DropdownMenuItem @click="isAddUserDialogOpen = true">
            <UserPlus :size="16" class="mr-2" />
            Add User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddUsersDialog
        v-model:open="isAddUserDialogOpen"
        :chat-title="chatTitle"
        :chat-id="chatId"
        @add-users="handleAddUsers"
        @cancel="handleCancelAddUsers"
      />

      <AvatarEditorDialog
        v-model:open="isAvatarDialogOpen"
        title="Edit Chat Avatar"
        description="Upload and crop the chat avatar"
        :container-size="400"
        :output-size="512"
        @save="handleAvatarSave"
      />
    </div>
  </header>
</template>
