<script setup lang="ts">
import { computed } from 'vue';

import type { User } from '@/entities/user';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Skeleton } from '@/shared/ui/skeleton';

import UserListItem from './UserListItem.vue';

interface Props {
  users?: User[];
  isLoading?: boolean;
  searchQuery: string;
}

const props = withDefaults(defineProps<Props>(), {
  users: () => [],
  isLoading: false
});

const emit = defineEmits<{
  userClick: [userId: string];
}>();

const filteredUsers = computed(() => {
  if (!props.searchQuery.trim()) {
    return props.users;
  }

  const query = props.searchQuery.toLowerCase().trim();
  return props.users.filter(user => {
    const username = user.username?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    return username.includes(query) || email.includes(query);
  });
});

const hasResults = computed(() => filteredUsers.value.length > 0);

function handleUserClick(userId: string) {
  emit('userClick', userId);
}
</script>

<template>
  <ScrollArea class="h-full w-full flex-1">
    <div v-if="isLoading" class="space-y-2 p-2">
      <div v-for="i in 8" :key="i" class="flex items-center gap-3 px-4 py-3">
        <Skeleton class="size-10 rounded-full" />
        <div class="flex-1 space-y-2">
          <Skeleton class="h-4 w-3/4" />
          <Skeleton class="h-3 w-1/2" />
        </div>
      </div>
    </div>

    <div
      v-else-if="!hasResults"
      class="flex h-full items-center justify-center p-8"
    >
      <div class="text-muted-foreground text-center">
        <p class="text-sm">
          {{ searchQuery ? 'No users found' : 'Start typing to search users' }}
        </p>
      </div>
    </div>

    <TransitionGroup v-else name="stagger-fade" tag="div">
      <UserListItem
        v-for="(user, index) in filteredUsers"
        :key="user.id"
        :user="user"
        :style="{ '--stagger-index': index }"
        @click="handleUserClick"
      />
    </TransitionGroup>
  </ScrollArea>
</template>

<style scoped>
/* Stagger fade-in animation for user list items */
.stagger-fade-enter-active {
  transition: all 0.25s ease-out;
  transition-delay: calc(var(--stagger-index) * 0.02s);
}

.stagger-fade-leave-active {
  transition: all 0.15s ease-in;
}

.stagger-fade-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.stagger-fade-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

.stagger-fade-move {
  transition: transform 0.25s ease-out;
}
</style>
