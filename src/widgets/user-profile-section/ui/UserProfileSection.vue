<script setup lang="ts">
import { inject, ref } from 'vue';

import { cn } from '@grapegram/ui-kit';

import { useUserStore } from '@/entities/user';
import { LogoutButton } from '@/features/auth';
import { UserAvatar } from '@/features/user-avatar';
import { UserProfileDialog } from '@/widgets/user-profile-dialog';

const userStore = useUserStore();
const isProfileDialogOpen = ref(false);

const sidebarMode = inject<'compact' | 'expanded'>('sidebarMode', 'expanded');

function handleAvatarClick() {
  isProfileDialogOpen.value = true;
}
</script>

<template>
  <div
    :class="
      cn('border-border flex items-center gap-2 border-b p-3', {
        'justify-center': sidebarMode === 'compact',
        'justify-start': sidebarMode === 'expanded'
      })
    "
  >
    <button
      type="button"
      class="cursor-pointer rounded-full transition-opacity hover:opacity-80 focus:outline-none"
      @click="handleAvatarClick"
    >
      <UserAvatar :user-id="userStore.user.id" size="sm" />
    </button>

    <LogoutButton v-if="sidebarMode === 'expanded'" />

    <UserProfileDialog
      v-model:open="isProfileDialogOpen"
      :user-id="userStore.user.id"
    />
  </div>
</template>
