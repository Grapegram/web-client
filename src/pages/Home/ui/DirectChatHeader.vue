<script setup lang="ts">
import { computed, ref } from 'vue';

import { EllipsisVertical, ImageIcon, Trash } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import { Button } from '@grapegram/ui-kit';

import type { Chat } from '@/entities/chat';
import {
  useChatStore,
  useDeleteChatMutation,
  useUploadChatAvatarMutation
} from '@/entities/chat';
import { useUserStore } from '@/entities/user';
import { AvatarEditorDialog } from '@/features/avatar-editor';
import type { CroppedImageResult } from '@/features/avatar-editor';
import { UserAvatar } from '@/features/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { UserProfileDialog } from '@/widgets/user-profile-dialog';

interface Props {
  chat: Chat;
}

const props = defineProps<Props>();

const usersStore = useUserStore();
const chatStore = useChatStore();

const chatId = computed(() => props.chat.id);

// Get the other user in the direct chat (not the current user)
const mate = computed(() => {
  const currentUserId = usersStore.user.id;
  const otherMember = props.chat.members.find(
    member => member.user_id !== currentUserId
  );

  if (!otherMember) return null;

  return usersStore.getUserById(otherMember.user_id);
});

const mateId = computed(() => {
  const currentUserId = usersStore.user.id;
  const otherMember = props.chat.members.find(
    member => member.user_id !== currentUserId
  );
  return otherMember?.user_id;
});

const chatTitle = computed(() => mate.value?.username || props.chat.title);

const isTyping = computed(() => {
  if (!mateId.value) return false;
  return chatStore.isMemberTypingInChat(chatId.value, mateId.value);
});

const chatStatusString = computed(() => {
  if (isTyping.value) return 'typing';
  if (!mate.value) return 'User not found';
  return mate.value.isOnline ? 'Online' : 'Offline';
});

const isAvatarDialogOpen = ref(false);
const isUserProfileDialogOpen = ref(false);

const { mutate: uploadAvatar } = useUploadChatAvatarMutation();
const { mutateAsync: deleteChat } = useDeleteChatMutation();

function handleOpenAvatarDialog() {
  isAvatarDialogOpen.value = true;
}

async function handleAvatarSave(result: CroppedImageResult) {
  try {
    await uploadAvatar({ chatId: chatId.value, file: result.file });
    toast.success('Chat avatar updated successfully!');
  } catch {
    toast.error('Failed to upload chat avatar. Please try again.');
  }
}

function handleAvatarClick() {
  isUserProfileDialogOpen.value = true;
}

async function handleDeleteChat() {
  try {
    await deleteChat({ chat_id: props.chat.id });
    toast.success('Chat deleted successfully!');
  } catch {
    toast.error('Failed to delete chat. Please try again.');
  }
}
</script>

<template>
  <header
    class="h-header bg-card border-border flex flex-row items-center justify-between gap-3 rounded-lg border p-3"
  >
    <UserAvatar
      size="sm"
      class="cursor-pointer transition-opacity hover:opacity-80"
      :user-id="mateId || ''"
      @click="handleAvatarClick"
    />
    <div class="flex grow flex-col items-start justify-center">
      <span>
        <strong>{{ chatTitle }}</strong>
      </span>
      <span
        :class="[
          'flex items-center gap-1 text-sm',
          mate?.isOnline ? 'text-accent font-bold' : 'text-muted-foreground'
        ]"
      >
        {{ chatStatusString }}
        <span v-if="isTyping" class="flex gap-0.5">
          <span class="animate-bounce-dot" style="animation-delay: 0ms">.</span>
          <span class="animate-bounce-dot" style="animation-delay: 150ms"
            >.</span
          >
          <span class="animate-bounce-dot" style="animation-delay: 300ms"
            >.</span
          >
        </span>
      </span>
    </div>

    <div class="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon">
            <EllipsisVertical :size="24" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="handleOpenAvatarDialog">
            <ImageIcon class="mr-2" />
            Change Avatar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleDeleteChat">
            <Trash class="mr-2" />
            Delete Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AvatarEditorDialog
        v-model:open="isAvatarDialogOpen"
        title="Edit Chat Avatar"
        description="Upload and crop the chat avatar"
        :container-size="400"
        :output-size="512"
        @save="handleAvatarSave"
      />

      <UserProfileDialog
        v-model:open="isUserProfileDialogOpen"
        :user-id="mateId"
      />
    </div>
  </header>
</template>

<style scoped>
@keyframes bounce-dot {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

.animate-bounce-dot {
  display: inline-block;
  animation: bounce-dot 1s infinite;
}
</style>
