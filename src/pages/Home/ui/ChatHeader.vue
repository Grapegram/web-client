<script setup lang="ts">
import { computed } from 'vue';

import { ChatType, useChatStore } from '@/entities/chat';

import DirectChatHeader from './DirectChatHeader.vue';
import GroupChatHeader from './GroupChatHeader.vue';

const chatStore = useChatStore();

const currentChat = computed(() => chatStore.currentChat);

const isDirectChat = computed(
  () => currentChat.value?.type === ChatType.DIRECT
);
const isGroupChat = computed(() => currentChat.value?.type === ChatType.GROUP);
const chatTitle = computed(
  () => currentChat.value?.title || 'No chat selected'
);
const chatId = computed(() => currentChat.value?.id || '');

const chatUsers = computed(
  () =>
    currentChat.value?.members
      ?.map(m => usersStore.getUserById(m.user_id))
      .filter(Boolean) || []
);
const membersCount = computed(() => currentChat.value?.members?.length ?? 0);
const onlineMembersCount = computed(
  () => chatUsers.value?.filter(user => user?.isOnline).length || 0
);
const chatStatusString = computed(
  () =>
    (membersCount.value === 1 ? '1 member' : `${membersCount.value} members`) +
    (onlineMembersCount.value > 0 ? `, ${onlineMembersCount.value} online` : '')
);

const isAddUserDialogOpen = ref(false);
const isAvatarDialogOpen = ref(false);
const isChatInfoDialogOpen = ref(false);

const { mutate: uploadAvatar } = useUploadChatAvatarMutation();
const { mutateAsync: deleteChat } = useDeleteChatMutation();

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
    await uploadAvatar({ chatId: chatId.value, file: result.file });
    toast.success('Chat avatar updated successfully!');
  } catch {
    toast.error('Failed to upload chat avatar. Please try again.');
  }
}

function handleAvatarClick() {
  if (currentChat.value) {
    isChatInfoDialogOpen.value = true;
  }
}

async function handleDeleteChat() {
  if (!currentChat.value) return;

  try {
    await deleteChat({ chat_id: currentChat.value.id });
    toast.success('Chat deleted successfully!');
  } catch {
    toast.error('Failed to delete chat. Please try again.');
  }
}
</script>

<template>
  <div v-if="currentChat">
    <DirectChatHeader v-if="isDirectChat" :chat="currentChat" />
    <GroupChatHeader v-else-if="isGroupChat" :chat="currentChat" />
  </div>
  <header
    v-else
    class="h-header bg-card border-border flex flex-row items-center justify-between gap-3 rounded-lg border p-3"
  >
    <div class="flex grow flex-col items-start justify-center">
      <span class="text-muted-foreground italic">No chat selected</span>
    </div>
  </header>
</template>
