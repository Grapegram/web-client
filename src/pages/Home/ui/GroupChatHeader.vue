<script setup lang="ts">
import { computed, ref } from 'vue';

import { EllipsisVertical, ImageIcon, Trash, UserPlus } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import { Button } from '@grapegram/ui-kit';

import type { Chat } from '@/entities/chat';
import {
  ChatApi,
  useChatStore,
  useDeleteChatMutation,
  useUploadChatAvatarMutation
} from '@/entities/chat';
import { useUserStore } from '@/entities/user';
import { AvatarEditorDialog } from '@/features/avatar-editor';
import type { CroppedImageResult } from '@/features/avatar-editor';
import { ChatAvatar } from '@/features/chat-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { AddUsersDialog } from '@/widgets/add-users-dialog';
import { ChatInfoDialog } from '@/widgets/chat-info-dialog';

interface Props {
  chat: Chat;
}

const props = defineProps<Props>();

const usersStore = useUserStore();
const chatStore = useChatStore();

const chatId = computed(() => props.chat.id);
const chatTitle = computed(() => props.chat.title);

const chatUsers = computed(() =>
  props.chat.members.map(m => usersStore.getUserById(m.user_id)).filter(Boolean)
);
const membersCount = computed(() => props.chat.members.length);
const onlineMembersCount = computed(
  () => chatUsers.value?.filter(user => user?.isOnline).length || 0
);

const typingMembers = computed(() => {
  return chatStore.getTypingMembersInChat(chatId.value);
});

const typingUsernames = computed(() => {
  return typingMembers.value
    .map(userId => usersStore.getUserById(userId)?.username)
    .filter(Boolean);
});

const typingStatusString = computed(() => {
  const count = typingUsernames.value.length;
  if (count === 0) return '';
  if (count === 1) return `${typingUsernames.value[0]} is typing`;
  if (count === 2)
    return `${typingUsernames.value[0]} and ${typingUsernames.value[1]} are typing`;
  return `${count} people are typing`;
});

const chatStatusString = computed(() => {
  if (typingStatusString.value) return typingStatusString.value;

  return (
    (membersCount.value === 1 ? '1 member' : `${membersCount.value} members`) +
    (onlineMembersCount.value > 0 ? `, ${onlineMembersCount.value} online` : '')
  );
});

const isAddUserDialogOpen = ref(false);
const isAvatarDialogOpen = ref(false);
const isChatInfoDialogOpen = ref(false);

const { mutate: uploadAvatar } = useUploadChatAvatarMutation();
const { mutateAsync: deleteChat } = useDeleteChatMutation();

const handleAddUsers = (userIds: string[]) => {
  Promise.allSettled(
    userIds.map(userId =>
      ChatApi.addMember({
        chat_id: props.chat.id,
        user_id: userId,
        role: 'member'
      })
    )
  );
};

const handleCancelAddUsers = () => {};

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
  isChatInfoDialogOpen.value = true;
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
    <ChatAvatar
      size="sm"
      class="cursor-pointer transition-opacity hover:opacity-80"
      :chat-id="chatId"
      @click="handleAvatarClick"
    />
    <div class="flex grow flex-col items-start justify-center">
      <span>
        <strong>{{ chatTitle }}</strong>
      </span>
      <span class="text-muted-foreground flex items-center gap-1 text-sm">
        {{ chatStatusString }}
        <span v-if="typingMembers.length > 0" class="flex gap-0.5">
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
          <DropdownMenuItem @click="isAddUserDialogOpen = true">
            <UserPlus class="mr-2" />
            Add Member
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleDeleteChat">
            <Trash class="mr-2" />
            Delete Chat
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

      <ChatInfoDialog v-model:open="isChatInfoDialogOpen" :chat-id="chatId" />
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
