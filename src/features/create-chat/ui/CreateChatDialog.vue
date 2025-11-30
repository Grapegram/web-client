<script setup lang="ts">
import { ref } from 'vue';

import { Field, FieldLabel, Input } from '@grapegram/ui-kit';

import { useChatStore } from '@/entities/chat';
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

defineProps<{
  asChild?: boolean;
}>();

const chatStore = useChatStore();

const open = ref(false);
const title = ref('');
const isLoading = ref(false);

const handleCreateChat = async () => {
  if (!title.value.trim()) return;

  isLoading.value = true;

  try {
    // Generate a unique ID for the new chat
    const chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create the chat in the store
    chatStore.addChat({
      id: chatId,
      title: title.value.trim(),
      members: [] // Add current user ID here when available
    });

    // Set as current chat
    chatStore.setCurrentChat(chatId);

    // Reset form and close dialog
    title.value = '';
    open.value = false;
  } catch (error) {
    console.error('Failed to create chat:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  title.value = '';
  open.value = false;
};

const handleOpenChange = (newOpen: boolean) => {
  open.value = newOpen;
  if (!newOpen) {
    title.value = '';
  }
};
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogTrigger :as-child="asChild">
      <slot />
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Chat</DialogTitle>
        <DialogDescription>
          Enter a title for your new chat. Click create when you're done.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input
            v-model="title"
            placeholder="Enter chat title..."
            :disabled="isLoading"
            @keydown.enter="handleCreateChat"
          />
        </Field>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          @click="handleCancel"
          :disabled="isLoading"
        >
          Cancel
        </Button>
        <Button
          type="button"
          @click="handleCreateChat"
          :disabled="!title.trim() || isLoading"
        >
          {{ isLoading ? 'Creating...' : 'Create' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
