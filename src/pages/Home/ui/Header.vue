<script setup lang="ts">
import { ref } from 'vue';

import { useUserStore } from '@/entities/user';
import { LogoutButton } from '@/features/auth';
import { UserAvatar } from '@/features/user-avatar';
import { Logo } from '@/shared/ui/logo';
import { UserProfileDialog } from '@/widgets/user-profile-dialog';

const userStore = useUserStore();
const isProfileDialogOpen = ref(false);

function handleAvatarClick() {
  isProfileDialogOpen.value = true;
}
</script>

<template>
  <header class="bg-card flex h-18 flex-row items-center gap-2 border-b px-5">
    <Logo class="flex-1" with-text />
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="cursor-pointer rounded-full transition-opacity hover:opacity-80 focus:outline-none"
        @click="handleAvatarClick"
      >
        <UserAvatar :user-id="userStore.user.id" size="sm" />
      </button>

      <LogoutButton />
    </div>

    <UserProfileDialog
      v-model:open="isProfileDialogOpen"
      :user-id="userStore.user.id"
    />
  </header>
</template>
