<script setup lang="ts">
import { inject, ref } from 'vue';

import { Settings } from 'lucide-vue-next';

import { Button, cn } from '@grapegram/ui-kit';

import { useUserStore } from '@/entities/user';
import { UserProfileDialog } from '@/widgets/user-profile-dialog';

import UserSearchInput from './user-search/UserSearchInput.vue';

const userStore = useUserStore();
const isProfileDialogOpen = ref(false);
const searchQuery = ref('');
const isSearchFocused = ref(false);

const sidebarMode = inject<'compact' | 'expanded'>('sidebarMode', 'expanded');

const emit = defineEmits<{
  searchFocus: [];
  searchBlur: [];
  searchQueryChange: [query: string];
}>();

function handleAvatarClick() {
  isProfileDialogOpen.value = true;
}

function handleSearchFocus() {
  isSearchFocused.value = true;
  emit('searchFocus');
}

function handleSearchBlur() {
  isSearchFocused.value = false;
  emit('searchBlur');
}

function handleSearchQueryChange(query: string) {
  searchQuery.value = query;
  emit('searchQueryChange', query);
}
</script>

<template>
  <div class="border-border flex flex-col gap-2 border-b p-3">
    <div
      :class="
        cn('flex items-center gap-5', {
          'justify-center': sidebarMode === 'compact',
          'justify-start': sidebarMode === 'expanded'
        })
      "
    >
      <Button
        variant="ghost"
        size="icon"
        @click="handleAvatarClick"
        class="size-12"
      >
        <Settings class="size-5" />
      </Button>

      <Transition name="fade-slide-down">
        <UserSearchInput
          v-if="sidebarMode === 'expanded'"
          :model-value="searchQuery"
          @update:model-value="handleSearchQueryChange"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
        />
      </Transition>
    </div>
    <UserProfileDialog
      v-model:open="isProfileDialogOpen"
      :user-id="userStore.user.id"
    />
  </div>
</template>

<style scoped>
/* Fade and slide down transition for search input */
.fade-slide-down-enter-active {
  transition: all 0.2s ease-out;
}

.fade-slide-down-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-slide-down-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
