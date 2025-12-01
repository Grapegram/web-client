<script setup lang="ts">
import { ref } from 'vue';

import { toast } from 'vue-sonner';

import { Field, FieldLabel, Input } from '@grapegram/ui-kit';

import { useChatStore, useCreateChatMutation } from '@/entities/chat';
import type { ApiError } from '@/shared/api';
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
const { mutateAsync, asyncStatus } = useCreateChatMutation();

const open = ref(false);
const title = ref('');

const handleCreateChat = async () => {
  if (!title.value.trim()) return;

  try {
    const result = await mutateAsync({ title: title.value.trim() });

    if (result) {
      // Set as current chat
      chatStore.setCurrentChat(result.chat_id);

      toast.success('Chat created!', {
        description: `"${result.title}" is ready for messages."`
      });

      // Reset form and close dialog
      title.value = '';
      open.value = false;
    }
  } catch (err) {
    toast.error('Failed to create chat', {
      description: (err as ApiError).detail
    });
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
            :disabled="asyncStatus === 'loading'"
            @keydown.enter="handleCreateChat"
          />
        </Field>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          @click="handleCancel"
          :disabled="asyncStatus === 'loading'"
        >
          Cancel
        </Button>
        <Button
          type="button"
          @click="handleCreateChat"
          :disabled="!title.trim() || asyncStatus === 'loading'"
        >
          {{ asyncStatus === 'loading' ? 'Creating...' : 'Create' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
